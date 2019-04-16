<template>
  <div class="test" v-if="config">

    <div class="navbar">
      <div>
        <h1>{{config.name}}</h1>
        <h2>{{config.url}}</h2>
      </div>
      <div class="menu">
        <button class="btn btn-transparent" @click="onClickClear" v-if="!isRunning" v-tooltip.bottom="'Clear'">
          <Icon icon='ban' size='lg' />
        </button>
        <button class="btn btn-transparent danger-color" @click="onClickStop" v-if="isRunning" v-tooltip.bottom="'Stop Test'">
          <Icon icon='stop-circle' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickRun" v-if="!isRunning" v-tooltip.bottom="'Run Test'">
          <Icon icon='play-circle' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickRunCloud" v-if="!isRunning" v-tooltip.bottom="'Run Test in Cloud'">
          <Icon icon='cloud-upload-alt' size='lg' />
        </button>
        <div class="divider-h"></div>
        <button class="btn btn-transparent" @click="onClickEdit" v-tooltip.bottom="'Edit Test'">
          <Icon icon='pen' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickDelete"  v-tooltip.bottom="'Delete Test'">
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
      <div class="row">
        <Panel header='Responses' ref="responses">
          <ResponseListItem v-for="(response, i) in displayResponses" :key="i" :response="response"></ResponseListItem>
        </Panel>
        <Panel header='Latency'>
          <ApexCharts
            :series="[{ data: [23, 34, 12, 54, 32, 43] }]"

            />
        </Panel>
      </div>
    </div>

    <Panel header='Terminal' css='panel-terminal' ref="terminal" :is-collapsible="true" :is-searchable="true">
      <div v-for="(log, i) in displayLogs" :key="i" :class="log.css" slot="default">{{getDisplayLog(log)}}</div>
    </Panel>

  </div>
</template>

<script>

  import ResponseListItem from './ResponseListItem';
  import ApexCharts from 'apexcharts'

  export default {
    name: 'config',
    components: {
      ResponseListItem,
      ApexCharts
    },
    data() {
      return {
        confidId: null,
        config: null,
        artillery: null,
      };
    },
    methods: {
      onClickClear() {
        this.clear();
      },
      clear() {
        console.clear();
        this.$store.dispatch('Job/clearJob', this.config.id);
      },
      onClickStop() {
        this.$store.dispatch('Job/stopJob', this.config.id);
      },
      async onClickRun() {
        this.clear();
        this.$store.dispatch('Job/startJob', this.config.id);
      },
      onClickRunCloud() {
        // Integrate running in cloud
      },
      onClickEdit() {
        this.$router.push({ name: 'test-edit', params: { config_id: this.config.id } });
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
          this.$store.dispatch('Config/deleteConfig', this.config.id);
        }
      },
    },
    watch: {
      'job.responses': function (is, was) {
        this.$refs.responses.scroll();
      },
      'job.logs': function (is, was) {
        this.$refs.terminal.scroll();
      },
    },
    computed: {
      job() {
        return this.config ? this.$store.getters['Job/getJobByConfigId'](this.config.id) : null;
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
      displayResponses() {
        return this.job ? this.job.responses : [];
      },
      displayLogs() {
        return this.job ? this.job.logs : [];
      },
      errors() {
        const errors = [];
        if (this.config.scenarios.length === 0) {
          errors.push({ text: "Test is missing scenarios. Running this test won't produce any results.", type: 'danger' });
        }
        return errors;
      },
      getProgressStyle() {
        // TODO calculate
        const progress = 25;
        return `width: ${progress}%`;
      },
    },
    mounted() {
      if (this.$refs.terminal) {
        this.$refs.terminal.scroll();
      }
    },
    created() {
      const params = this.$router.currentRoute.params;
      this.configId = params.config_id;
      this.config = this.$store.getters['Config/getConfig'](this.configId);
    },
  };

</script>

<style lang="scss" scoped>

  @import "../styles/vars.scss";

  .test {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  $navbar-height: 64px;
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $navbar-height;
    padding-left: 10px;
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
    padding: 15px;
    background-color: $background-color-light;
  }

  .row {
    display: flex;
    flex: 1;
    .panel {
      & + .panel {
        margin-left: 10px;
      }
    }
  }

</style>
