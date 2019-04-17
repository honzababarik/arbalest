<template>
  <div class="test" v-if="test">

    <div class="navbar">
      <div>
        <h1>{{test.name}}</h1>
        <h2>{{test.url}}</h2>
      </div>
      <div class="menu">
        <button class="btn btn-transparent" @click="onClickClear" v-if="!isRunning" v-tooltip="'Clear'">
          <Icon icon='ban' size='lg' />
        </button>
        <button class="btn btn-transparent danger-color" @click="onClickStop" v-if="isRunning" v-tooltip="'Stop Test'">
          <Icon icon='stop-circle' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickRun" v-if="!isRunning" v-tooltip="'Run Test'">
          <Icon icon='play-circle' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickRunCloud" v-if="!isRunning" v-tooltip="'Run Test in Cloud'">
          <Icon icon='cloud-upload-alt' size='lg' />
        </button>
        <div class="divider-h"></div>
        <button class="btn btn-transparent" @click="onClickEdit" v-tooltip="'Edit Test'">
          <Icon icon='pen' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickDelete"  v-tooltip="'Delete Test'">
          <Icon icon='trash-alt' size='lg' />
        </button>
      </div>
    </div>

    <div class="errors" v-if="errors.length > 0">
      <div class="error" v-for="(error, i) in errors" :class="error.type" :key="i">{{error.text}}</div>
    </div>

    <div class="progress" v-if="isRunning">
      <div class="value" :style="getProgressStyle"></div>
    </div>

    <div class="content">
      <div class="row flex-1 bottom-md" v-if="shouldShowCharts">
        <div class="card card-absolute">
          <div class="header">Response Codes</div>
          <div class="body">
            <Chart type="donut" height="100%" :options="codesChartOptions" :series="codesChartOptions.series" />
          </div>
        </div>
        <div class="card card-center">
          <div class="header">Response Time Summary</div>
          <div class="body">
            <div class="icon-view" v-if="isRunning">
              <Icon icon='hourglass' :spin='true' />
            </div>
            <Chart type="bar" :options="summaryChartOptions" :series="summaryChartData" v-if="!isRunning && report" />
          </div>
        </div>
        <div class="card card-center">
          <div class="header">Elapsed time</div>
          <div class="body">
            <span>{{getElapsedTime}}</span>
          </div>
        </div>
        <div class="card card-center">
          <div class="header">Est Remaining time</div>
          <div class="body">
            <div class="icon-view" v-if="isRunning && !getRemainingTime">
              <Icon icon='hourglass' :spin='true' />
            </div>
            <span v-else>{{getRemainingTime}}</span>
          </div>
        </div>
      </div>
      <div class="row flex-2">
        <Panel header='Responses' ref="responses">
          <ResponseListItem v-for="(response, i) in responses" :key="i" :response="response"></ResponseListItem>
        </Panel>
        <Panel header='Response Time' :css="shouldShowCharts ? 'panel-response-times active' : 'panel-response-times inactive'">
          <Chart v-if="shouldShowCharts" height="100%" :options="latencyChartOptions" :series="latencyChartData" />
          <div v-else>
            <div class="icon-view" v-if="isRunning">
              <Icon icon='hourglass' :spin='true' size='2x' />
              <span>Collecting data...</span>
            </div>
            <div class="icon-view" v-else>
              <Icon icon='pause' size='2x' />
              <span>Run the test to display response times</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>

    <Panel header='Terminal' css='panel-terminal' ref="terminal" :is-collapsible="true" :is-collapsed="true" :is-searchable="true">
      <div v-for="(log, i) in logs" :key="i" :class="log.css" slot="default">{{getDisplayLog(log)}}</div>
    </Panel>

  </div>
</template>

<script>

  import ResponseListItem from './ResponseListItem';
  import Timer from '@/../lib/timer';

  const REMAINING_TIME_EST_MIN_RESPONSE_LIMIT = 5

  export default {
    name: 'test',
    components: {
      ResponseListItem,
    },
    data() {
      return {
        testId: null,
        test: null,
        artillery: null,
        elapsed: {
          minutes: 0,
          seconds: 0,
          timer: null
        },
        remaining: {
          minutes: 0,
          seconds: 0
        }
      };
    },
    methods: {
      onClickClear() {
        this.clear();
      },
      clear() {
        console.clear();
        this.$store.dispatch('Job/clearJob', this.test.id);
      },
      onClickStop() {
        this.$store.dispatch('Job/stopJob', this.test.id);
      },
      async onClickRun() {
        this.clear();
        this.$store.dispatch('Job/startJob', this.test);
      },
      onClickRunCloud() {
        this.$dvlt.notify('Cloud integration is not yet implemented.', 'warn');
      },
      onClickEdit() {
        this.$router.push({ name: 'test-edit', params: { test_id: this.test.id } });
      },
      getDisplayLog(log) {
        const time = log.time.toLocaleString();
        return `[${time}] ${log.text}`;
      },
      onClickDelete() {
        if (this.isRunning) {
          this.$dvlt.notify("You cannot delete the test while it's running. Stop the test first and delete it afterwards.", 'warn');
          return;
        }
        if (confirm('Are you sure you want to delete this test?')) {
          this.$router.push({ name: 'home' });
          this.$store.dispatch('Test/deleteTest', this.test.id);
        }
      },
      getStatusCodeColor(statusCode) {
        if (statusCode >= 200 && statusCode < 300) {
          return '#669236';
        }
        if (statusCode >= 400 && statusCode < 500) {
          return '#CA9235';
        }
        if (statusCode >= 500) {
          return '#923C3C';
        }
        return '#246EC3';
      },
      startElapsedTimer() {
        this.elapsed.timer.start()
      },
      stopElapsedTimer() {
        this.elapsed.timer.stop()
      },
      onElapsedTimerTick(e) {
        this.elapsed.minutes = e.minutes;
        this.elapsed.seconds = e.seconds;
        if (this.getMaxResponses && this.responses.length >= REMAINING_TIME_EST_MIN_RESPONSE_LIMIT) {
          const elapsedSeconds = this.elapsed.minutes * 60 + this.elapsed.seconds;
          const estimatedSeconds = Math.floor(this.getMaxResponses / this.responses.length * elapsedSeconds)
          const remainingTime = this.$dvlt.time.getTimeUnits(estimatedSeconds - elapsedSeconds);
          this.remaining.minutes = remainingTime.minutes
          this.remaining.seconds = remainingTime.seconds
        }
      }
    },
    watch: {
      'job.responses': function (is, was) {
        this.$refs.responses.scroll();
      },
      'job.logs': function (is, was) {
        this.$refs.terminal.scroll();
      },
      'job.is_running': function (isRunning, wasRunning) {
        if (isRunning && !wasRunning) {
          this.startElapsedTimer()
        }
        if (!isRunning && wasRunning) {
          this.stopElapsedTimer()
        }
      },
    },
    computed: {
      job() {
        return this.test ? this.$store.getters['Job/getJobByTestId'](this.test.id) : null;
      },
      settings() {
        return this.$store.getters['Settings/getSettings'];
      },
      environment() {
        return this.$store.getters['Environment/getCurrentEnvironment'];
      },
      isRunning() {
        return this.job && this.job.is_running;
      },
      responses() {
        return this.job ? this.job.responses : [];
      },
      logs() {
        return this.job ? this.job.logs : [];
      },
      report() {
        return this.job ? this.job.report : null;
      },
      errors() {
        const errors = [];
        if (this.test.scenarios.length === 0) {
          errors.push({ text: "Test is missing scenarios. Running this test won't produce any results.", type: 'danger' });
        }
        return errors;
      },
      getMaxResponses() {
        if (!this.job) {
          return 0;
        }
        return this.job.duration * this.job.rate * this.job.scenarioCount;
      },
      getProgressPerc() {
        if (this.getMaxResponses) {
          return Math.floor(this.responses.length / this.getMaxResponses * 100);
        }
      },
      getProgressStyle() {
        return `width: ${this.getProgressPerc}%`;
      },
      getElapsedTime() {
        if (!this.elapsed.minutes && !this.elapsed.seconds) {
          return '--'
        }
        return `${this.elapsed.minutes}m ${this.elapsed.seconds}s`
      },
      getRemainingTime() {
        if (!this.remaining.minutes && !this.remaining.seconds) {
          return '--'
        }
        return `${this.remaining.minutes}m ${this.remaining.seconds}s`;
      },
      shouldShowCharts() {
        return this.responses.length > 0;
      },
      codesChartOptions() {
        const options = {
          colors: [],
          labels: [],
          series: [],
        };

        this.responses.forEach((response) => {
          const index = options.labels.indexOf(response.status_code);
          if (index === -1) {
            options.labels.push(response.status_code);
            options.colors.push(this.getStatusCodeColor(response.status_code));
            options.series.push(1);
          }
          else {
            options.series[index] += 1;
          }
        });

        return {
          chart: {
            id: 'chart-codes',
          },
          legend: {
            show: false,
          },
          stroke: {
            width: 1,
            colors: 'rgba(40, 40, 40, 1)',
          },
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                  name: {
                    show: false
                  },
                  total: {
                    show: true,
                    label: '',
                  },
                },
              },
              dataLabels: {
                offset: 3,
              },
            },
          },
          dataLabels: {
            formatter(val) {
              return `${Math.floor(val)}%`;
            },
            dropShadow: {
              enabled: false,
            },
          },
          ...options,
        };
      },
      summaryChartOptions() {
        return {
          chart: {
            id: 'chart-summary',
            toolbar: {
              show: false
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: 'rounded',
              dataLabels: {
                position: 'top'
              }
            },
          },
          dataLabels: {
            offsetY: -20,
          },
          tooltip: {
            enabled: false,
          },
          xaxis: {
            categories: ['min', 'med', 'max', 'p95', 'p99']
          },
          yaxis: {
            show: false,
          },
          grid: {
            show: false,
          }
        }
      },
      summaryChartData() {
        const latency = this.report.latency
        return [{
          name: 'Latency',
          data: [
            latency.min,
            latency.med,
            latency.max,
            latency.p95,
            latency.p99,
          ]
        }]
      },
      latencyChartOptions() {
        return {
          stroke: {
            curve: 'smooth',
          },
          chart: {
            id: 'chart-latency',
            toolbar: {
              show: true,
              tools: {
                download: false,
              },
            },
          },
          tooltip: {
            x: {
              show: false,
            },
            fixed: {
              enabled: true,
              position: 'topLeft',
            },
          },
          yaxis: {
            labels: {
              formatter: (latency) => {
                return `${latency}ms`;
              },
            },
          },
          xaxis: {
            type: 'numeric',
            labels: {
              formatter: (msSinceStart) => {
                const sSinceStart = Math.floor(msSinceStart / 1000);
                return `${sSinceStart}s`;
              },
            },
          },
        };
      },
      latencyChartData() {
        const data = this.responses.map((response) => {
          const msSinceStart = response.ended_at - this.job.started_at;
          return {
            x: msSinceStart,
            y: response.time,
          };
        });
        if (data.length === 0) {
          return [];
        }
        return [{
          name: 'Latency',
          data,
        }];
      },
    },
    mounted() {
      if (this.$refs.terminal) {
        this.$refs.terminal.scroll();
      }
    },
    beforeDestroy() {
      this.stopElapsedTimer();
      this.elapsed.timer.removeAllListeners();
    },
    created() {
      const params = this.$router.currentRoute.params;
      this.testId = params.test_id;
      this.test = this.$store.getters['Test/getTest'](this.testId);
      this.elapsed.timer = new Timer();
      this.elapsed.timer.on('tick', this.onElapsedTimerTick)
    },
  };

</script>

<style lang="scss">

  @import "../styles/vars.scss";

  $navbar-height: 64px;
  .test {
    flex: 1;
    display: flex;
    flex-direction: column;

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: $navbar-height;
      padding: 0 10px;
      h1 {
        font-size: 16px;
        margin: 0 0 4px 0;
        padding: 0;
      }
      h2 {
        font-size: 12px;
        font-weight: normal;
        color: $text-color-dark;
        margin: 0;
        padding: 0;
      }
      .menu {
        display: flex;
        height: inherit;
      }
      button {
        height: inherit;
        width: $navbar-height;
        padding: 18px 18px;
        border-radius: 0;
        &:hover {
          background-color: $button-hover-color;
        }
      }
    }

    .errors {
      .error {
        color: white;
        padding: 15px 10px;
        &.danger {
          font-size: 13px;
          background-color: $danger-color;
        }
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      flex: 2;
      padding: $window-padding;
      background-color: $background-color-light;
    }

    .row {
      display: flex;
      .panel {
        & + .panel {
          margin-left: $window-padding;
        }
      }
    }

  }

  .card {
    border-radius: $border-radius;
    background-color: $card-background-color;
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 15px;
    overflow-x: hidden;
    overflow-y: scroll;
    .header {
      color: $text-color-dark;
      font-size: 13px;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 15px;
    }
    .body {
      flex: 1;
      display: flex;
    }
    & + .card {
      margin-left: $window-padding;
    }
    &.card-absolute {
      justify-content: center;
      position: relative;
      padding: 20px 15px;
      overflow-y: hidden;
      .header {
        position: absolute;
        top: 15px;
        left: 0;
        right: 0;
      }
      .body {
        flex: initial;
        display: block;
      }
    }
    &.card-center {
      .body {
        align-items: center;
        justify-content: center;
        font-size: 40px;
      }
    }
  }

  .icon-view {
    color: $text-color-dark;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg {
      display: block;
    }
    span {
      margin-top: 20px;
    }
  }

  .panel {
    &.inactive {
      .panel-body {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &.active {
      .panel-body {
        padding: 10px 0;
      }
    }
  }

  $chart-label-color: $text-color-dark;
  $chart-line-color: $text-color-dark;
  $chart-legend-color: $text-color-dark;

  .apexcharts-canvas {
    background-color: transparent;
    .apexcharts-tooltip {
      background: $tooltip-background-color;
      border-color: $tooltip-border-color;
    }
    .apexcharts-yaxis-label, .apexcharts-xaxis-label {
      fill: $chart-label-color;
    }
    .apexcharts-gridline {
      stroke: $chart-line-color;
    }
    .apexcharts-legend-series {
      display: flex;
      align-items: center;
    }
    .apexcharts-legend-text {
      color: $chart-legend-color !important;
    }
    .apexcharts-datalabels-group {
      transform: translate(0, -10px);
    }
    .apexcharts-datalabel-label, .apexcharts-datalabel-value {
      text-transform: uppercase;
      fill: $chart-legend-color !important;
    }
  }

</style>
