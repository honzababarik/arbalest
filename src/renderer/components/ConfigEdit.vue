<template>

  <Panel :header="isCreate ? 'Create Config' : 'Edit Config'" css='panel-config'>
    <div class="form-group">
      <label>Name</label>
      <input type="text" v-model="config.name" placeholder="https://google.com">
    </div>
    <div class="form-group">
      <label>URL</label>
      <input type="text" v-model="config.url" placeholder="https://google.com">
    </div>
    <div class="d-flex">
      <div class="form-group right-sm">
        <label>Duration (in seconds)</label>
        <input type="number" v-model.number="config.duration">
      </div>
      <div class="form-group left-sm">
        <label>Rate</label>
        <input type="number" v-model.number="config.rate">
      </div>
    </div>

    <hr>

    <div class="form-group">
      <label>Headers</label>
      <div class="d-flex bottom-sm" v-for="(header, i) in config.headers" :key="i">
        <input class="form-control form-control-xs flex-1" type="text" v-model="header.name" placeholder="Name">
        <input class="form-control form-control-xs flex-1 left-sm" type="text" v-model="header.value" placeholder="Value">
        <button class="btn left-sm btn-xs" @click="onClickRemoveHeader(i)">Remove</button>
      </div>
    </div>
    <button class="btn btn-info btn-xs" @click="onClickAddHeader">Add Header</button>

    <hr>

    <div class="form-group">
      <label>Scenarios</label>
      <div class="d-flex bottom-sm" v-for="(scenario, i) in config.scenarios" :key="i">
        <input class="form-control form-control-xs flex-1" type="text" v-model="scenario.method" placeholder="Method">
        <input class="form-control form-control-xs flex-4 left-sm" type="text" v-model="scenario.url" placeholder="URL">
        <button class="btn left-sm btn-xs" @click="onClickRemoveScenario(i)">Remove</button>
      </div>
    </div>
    <button class="btn btn-info btn-xs" @click="onClickAddScenario">Add Scenario</button>

    <div class="d-flex" slot="footer">
      <div></div>
      <button class="btn btn-success" @click="onClickSave">
        {{isCreate ? 'Create' : 'Save changes'}}
      </button>
    </div>
  </Panel>

</template>

<script>
  import Panel from './Panel'

  export default {
    components: {
      Panel
    },
    data: function() {
      return {
        configId: null,
        config: {
          name: `New Config [${Math.floor(Math.random() * 1000)}]`,
          url: 'https://google.com',
          duration: 10,
          rate: 1,
          headers: [{ name: null, value: null }],
          scenarios: [{ method: 'GET', url: '/' }],
        },
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        errors: [],
      };
    },
    methods: {
      onClickAddScenario() {
        this.config.scenarios.push({ method: 'GET', url: '/' })
      },
      onClickAddHeader() {
        this.config.headers.push({ name: null, value: null })
      },
      onClickRemoveHeader(index) {
        this.config.headers.splice(index, 1)
      },
      onClickRemoveScenario(index) {
        this.config.scenarios.splice(index, 1)
      },
      hasError(field) {
        return this.errors.indexOf(field) !== -1
      },
      isValidForm() {
        const errors = []
        // TODO validate URL

        if (this.config.name.length === 0) {
          errors.push('name')
        }
        if (this.config.duration < 1) {
          errors.push('duration')
        }
        if (this.config.rate < 1) {
          errors.push('rate')
        }
        if (this.getScenarios().length === 0) {
          errors.push('scenarios')
        }

        this.errors = errors
        return errors.length === 0
      },
      onClickSave() {
        if (!this.isValidForm()) {
          return;
        }

        // TODO show notification
        const config = this.config
        const data = {
          name: config.name,
          url: config.url,
          duration: config.duration,
          rate: config.rate,
          headers: this.getHeaders(),
          scenarios: this.getScenarios()
        }
        if (this.isCreate) {
          this.createConfig(data)
        }
        else {
          this.updateConfig(data)
        }
      },
      createConfig(data) {
        this.$store.dispatch('Config/addConfig', data)
      },
      updateConfig(data) {
        this.$store.dispatch('Config/updateConfig', {
          id: this.configId,
          data: data
        })
      },
      getHeaders() {
        return this.config.headers.filter(header => {
          return header.name && header.value
        })
      },
      getScenarios() {
        return this.config.scenarios.filter(scenario => {
          // TODO should validate URL is correct in addition to the base URL
          return scenario.method && scenario.url
        })
      },
    },
    computed: {
      isCreate() {
        return this.configId === null
      }
    },
    mounted() {
      const configId = this.$router.currentRoute.params['config_id'];
      if (configId) {
        this.configId = configId;
        this.config = Object.assign({}, this.$store.getters['Config/getConfig'](configId))
      }
    }
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .panel-config {
    .panel-body {
      flex: 1;
      padding: 15px 10px;
    }
  }

</style>
