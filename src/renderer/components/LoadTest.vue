<template>
  <div class="wrapper">
    <div class="navbar">
      <button @click="onClickClear" v-if="isRunning">Clear</button>
      <button class="btn-danger" @click="onClickStop" v-if="isRunning">Stop</button>
      <button class="btn-success" @click="onClickRun">Run</button>

    </div>
    <div class="content">
      <div class="panel panel-terminal">
        <div class="panel-header">Terminal</div>
        <div class="panel-body">
          <div v-for="(log, i) in logs" :key="i" :class="log.css">{{getDisplayLog(log)}}</div>
        </div>
      </div>
      <div class="panel panel-responses">
        <div class="panel-header">Responses</div>
        <div class="panel-body">
          <ResponseListItem v-for="(response, i) in responses" :key="i" :response="response"></ResponseListItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import router from '@/router/';
  import ResponseListItem from './ResponseListItem'
  import Storage from '@/../lib/storage.js'
  import ConfigurationBuilder from '@/../lib/builder.js'
  import Artillery from '@/../lib/artillery.js'

  export default {
    name: 'load_test',
    components: {
      ResponseListItem
    },
    data() {
      return {
        responses: [],
        logs: [],
        report: {},
        artillery: null
      };
    },
    methods: {
      onClickClear() {
        this.clear()
      },
      clear() {
        console.clear()
        this.responses = []
        this.logs = []
        this.report = {}
      },
      onClickStop() {
        this.artillery.stop()
      },
      onResponse(response) {
        this.responses.push(response)
      },
      onLine(line) {
        this.addLogLine(line)
      },
      onError(err) {
        this.addLogLine(`Err: ${err}`, 'danger')
      },
      onReport(reportPath) {
        this.addLogLine(`Report is available here: ${reportPath}`, 'warning');
      },
      onExit(exitCode) {
        if (exitCode === 0) {
          this.addLogLine(`Test finished!`, 'success')
        }
        else {
          this.addLogLine(`Command failed with code: ${exitCode}`, 'danger')
        }
      },
      async onClickRun() {
        this.clear()
        this.addLogLine('Command start...')

        const builder = new ConfigurationBuilder('https://api-dev.tripitlabs.us/airator', 5, 1)
        builder.addScenario('get', '/status')

        const filePath = await new Storage().createTempJson(builder.toJSON())
        this.addLogLine(`Configuration stored under: ${filePath}`)

        if (!this.artillery) {
          this.artillery = new Artillery()
            .on('response', this.onResponse)
            .on('line', this.onLine)
            .on('report', this.onReport)
            .on('error', this.onError)
            .on('exit', this.onExit)
        }

        this.artillery.run(filePath)
      },
      addLogLine(text, cssClass = '') {
        this.logs.push({ text, time: new Date(), css: cssClass + '-color' })
      },
      getDisplayLog(log) {
        const time = log.time.toLocaleString();
        return `[${time}] ${log.text}`
      }
    },
    computed: {
      isRunning() {
        return this.artillery && this.artillery.isRunning()
      }
    },
    beforeDestroy() {
      if (this.artillery) {
        this.artillery.stop()
        this.artillery.removeAllListeners()
      }
    }
  };

</script>

<style lang="scss">

  @import "../styles/vars.scss";

  $navbar-height: 70px;

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    height: $navbar-height;
  }

  .content {
    display: flex;
    flex-direction: row;
    height: calc(100vh - #{$navbar-height});
  }

  .panel-terminal {
    .panel-body {
      font-family: Consolas, monospace;
      white-space: pre-wrap;
      font-size: 14px;
      padding: 15px 10px;
      word-break: break-all;
    }
  }

</style>
