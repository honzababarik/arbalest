<template>
  <div class="wrapper" v-if="config">
    <div class="navbar">
      <div>
        <h1>{{config.name}}</h1>
        <h2>{{config.url}}</h2>
      </div>
      <div class="menu">
        <button class="btn btn-transparent" @click="onClickClear" v-if="isRunning">
          <font-awesome-icon icon='ban' size='lg' />
        </button>
        <button class="btn btn-transparent danger-color" @click="onClickStop" v-if="isRunning">
          <font-awesome-icon icon='stop-circle' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickRun" v-else>
          <font-awesome-icon icon='play-circle' size='lg' />
        </button>
        <div class="divider-h"></div>
        <button class="btn btn-transparent" @click="onClickEdit">
          <font-awesome-icon icon='pen' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickDelete">
          <font-awesome-icon icon='trash-alt' size='lg' />
        </button>
      </div>
    </div>
    <div class="content">
      <Panel header='Responses' css='flex-3' ref="responses" :is-collapsible="true">
        <ResponseListItem v-for="(response, i) in responses" :key="i" :response="response"></ResponseListItem>
      </Panel>

      <Panel header='Terminal' css='panel-terminal' ref="terminal" :is-collapsible="true" :is-searchable="true" @search="onTerminalSearch">
        <div v-for="(log, i) in displayLogs" :key="i" :class="log.css" slot="default">{{getDisplayLog(log)}}</div>
      </Panel>
    </div>
  </div>
</template>

<script>

  import ResponseListItem from './ResponseListItem'
  import Storage from '@/../lib/storage.js'
  import ConfigurationBuilder from '@/../lib/builder.js'
  import Artillery from '@/../lib/artillery.js'

  export default {
    name: 'config',
    components: {
      ResponseListItem
    },
    data() {
      return {
        config: null,
        responses: [],
        logs: [],
        report: {},
        artillery: null,
        logFilter: null
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
      onClickTerminalSearch(e) {
        e.stopPropagation()
      },
      onClickStop() {
        this.artillery.stop()
      },
      onResponse(response) {
        this.responses.push(response)
        this.$refs.responses.scroll()
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

        const builder = new ConfigurationBuilder(this.config.url, this.config.duration, this.config.rate)

        for (let i = 0; i < this.config.headers.length; i++) {
          let header = this.config.headers[i]
          builder.addHeader(header.name, header.value)
        }
        for (let i = 0; i < this.config.scenarios.length; i++) {
          let scenario = this.config.scenarios[i]
          builder.addScenario(scenario.method.toLowerCase(), scenario.url)
        }

        const filePath = await new Storage().createTempJson(builder.toJSON())
        this.addLogLine(`Configuration stored under: ${filePath}`)

        this.artillery.run(filePath)
      },
      onClickEdit() {
        this.$router.push({ name: 'config-edit', params: { config_id: this.config.id }})
      },
      addLogLine(text, cssClass = '') {
        this.logs.push({ text, time: new Date(), css: cssClass + '-color' })
        this.$refs.terminal.scroll()
      },
      getDisplayLog(log) {
        const time = log.time.toLocaleString();
        return `[${time}] ${log.text}`
      },
      onClickDelete() {
        this.$router.push({ name: 'home' })
        this.$store.dispatch('Config/deleteConfig', this.config.id)
      },
      onTerminalSearch(query) {
        this.logFilter = query
      }
    },
    computed: {
      isRunning() {
        return this.artillery && this.artillery.isRunning()
      },
      displayLogs() {
        let logs = this.logs
        if (this.logFilter) {
          const filter = this.logFilter.toLowerCase()
          logs = logs.filter(log => log.text.toLowerCase().indexOf(filter) !== -1)
        }
        return logs
      }
    },
    beforeDestroy() {
      this.artillery.stop()
      this.artillery.removeAllListeners()
    },
    mounted() {
      this.artillery = new Artillery()
        .on('response', this.onResponse)
        .on('line', this.onLine)
        .on('report', this.onReport)
        .on('error', this.onError)
        .on('exit', this.onExit)

      const params = this.$router.currentRoute.params
      this.config = this.$store.getters['Config/getConfig'](params['config_id'])

      if (params['action'] === 'run') {
        this.$nextTick(() => {
          this.onClickRun()
        })
      }
    }
  };

</script>

<style lang="scss" scoped>

  @import "../styles/vars.scss";

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 75px;
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
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .panels {
    flex: 3;
    display: flex;
    overflow: hidden;
  }

  .divider-h {
    display: inline-block;
    border-left: 1px solid $border-color;
    height: 100%;
    margin-left: 10px;
    margin-right: 10px;
  }

  button {
    padding: 18px 18px;
  }

</style>
