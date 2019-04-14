<template>
  <div class="wrapper" v-if="config">

    <div class="navbar">
      <div>
        <h1>{{config.name}}</h1>
        <h2>{{config.url}}</h2>
      </div>
      <div class="menu">
        <button class="btn btn-transparent" @click="onClickClear" v-if="!isRunning">
          <Icon icon='ban' size='lg' />
        </button>
        <button class="btn btn-transparent danger-color" @click="onClickStop" v-if="isRunning">
          <Icon icon='stop-circle' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickRun" v-else>
          <Icon icon='play-circle' size='lg' />
        </button>
        <div class="divider-h"></div>
        <button class="btn btn-transparent" @click="onClickEdit">
          <Icon icon='pen' size='lg' />
        </button>
        <button class="btn btn-transparent" @click="onClickDelete">
          <Icon icon='trash-alt' size='lg' />
        </button>
      </div>
    </div>

    <div class="content">
      <Panel header='Responses' css='flex-3' ref="responses" :is-collapsible="true">
        <ResponseListItem v-for="(response, i) in displayResponses" :key="i" :response="response"></ResponseListItem>
      </Panel>

      <Panel header='Terminal' css='panel-terminal' ref="terminal" :is-collapsible="true" :is-searchable="true">
        <div v-for="(log, i) in displayLogs" :key="i" :class="log.css" slot="default">{{getDisplayLog(log)}}</div>
      </Panel>
    </div>

  </div>
</template>

<script>

  import ResponseListItem from './ResponseListItem'

  export default {
    name: 'config',
    components: {
      ResponseListItem
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
        this.clear()
      },
      clear() {
        console.clear()
        this.$store.dispatch('Job/clearJob', this.config.id)
      },
      onClickStop() {
        this.$store.dispatch('Job/stopJob', this.config.id)
      },
      async onClickRun() {
        this.clear()
        this.$store.dispatch('Job/startJob', this.config.id)
      },
      onClickEdit() {
        this.$router.push({ name: 'test-edit', params: { config_id: this.config.id }})
      },
      getDisplayLog(log) {
        const time = log.time.toLocaleString();
        return `[${time}] ${log.text}`
      },
      onClickDelete() {
        if (confirm('Are you sure you want to delete this test?')) {
          this.$router.push({ name: 'home' })
          this.$store.dispatch('Config/deleteConfig', this.config.id)
          // TODO should make sure the jobs not running
        }
      }
    },
    watch: {
      'job.responses'(is, was) {
        this.$refs.responses.scroll()
      },
      'job.logs'(is, was) {
        this.$refs.terminal.scroll()
      },
    },
    computed: {
      job() {
        return this.config ? this.$store.getters['Job/getJobByConfigId'](this.config.id) : null
      },
      settings() {
        return this.$store.getters['Settings/getSettings']
      },
      environment() {
        return this.$store.getters['Environment/getCurrentEnvironment']
      },
      isRunning() {
        return this.job && this.job.is_running
      },
      displayResponses() {
        return this.job ? this.job.responses : []
      },
      displayLogs() {
        return this.job ? this.job.logs : []
      }
    },
    mounted() {
      this.$refs.terminal.scroll()
    },
    created() {
      const params = this.$router.currentRoute.params;
      this.configId = params['config_id']
      this.config = this.$store.getters['Config/getConfig'](this.configId);
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

  button {
    padding: 18px 18px;
  }

</style>
