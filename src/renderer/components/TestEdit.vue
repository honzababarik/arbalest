<template>

  <Panel :header="isCreate ? 'Create Test' : 'Edit Test'" css='panel-config'>
    <div class="form-group" :class="{'error': this.hasError('name')}">
      <label>Name</label>
      <input type="text" v-model.trim="config.name" placeholder="New Load Test">
    </div>
    <div class="form-group" :class="{'error': this.hasError('url')}">
      <label>URL</label>
      <input type="text" v-model.trim="config.url" placeholder="https://example.com">
    </div>
    <div class="d-flex">
      <div class="form-group right-sm" :class="{'error': this.hasError('duration')}">
        <label>Duration (in seconds)</label>
        <input type="number" v-model.number="config.duration">
      </div>
      <div class="form-group left-sm" :class="{'error': this.hasError('rate')}">
        <label>Rate</label>
        <input type="number" v-model.number="config.rate">
      </div>
    </div>

    <hr>

    <div class="form-group" :class="{'error': this.hasError('headers')}">
      <label>Headers</label>
      <div class="d-flex bottom-sm" v-for="(header, i) in config.headers" :key="i">
        <input class="form-control form-control-xs flex-1" type="text" v-model.trim="header.name" placeholder="Name">
        <input class="form-control form-control-xs flex-1 left-sm" type="text" v-model.trim="header.value" placeholder="Value">
        <button class="btn left-sm btn-xs" @click="onClickRemoveHeader(i)">Remove</button>
      </div>
    </div>
    <button class="btn btn-info btn-xs" @click="onClickAddHeader">Add Header</button>

    <hr>

    <div class="form-group" :class="{'error': this.hasError('scenarios')}">
      <label>Scenarios</label>
      <ScenarioListItem
        v-for="(scenario, i) in config.scenarios" :key="i" :scenario="scenario" :base-url="config.url"
        @remove="onClickRemoveScenario" @edit="onClickEditScenario" />
    </div>
    <button class="btn btn-info btn-xs" @click="onClickAddScenario">Add Scenario</button>

    <template slot="footer">
      <div>
        <button class="btn btn-gray" @click="onClickCancel">
          Cancel
        </button>
      </div>
      <button class="btn btn-success" @click="onClickSave">
        {{isCreate ? 'Create' : 'Save changes'}}
      </button>
    </template>
  </Panel>

</template>

<script>
  import Panel from './Panel';
  import ScenarioListItem from './ScenarioListItem';
  import ScenarioModal from '../views/ScenarioModal';

  export default {
    components: {
      Panel,
      ScenarioListItem,
    },
    data() {
      return {
        configId: null,
        config: {
          name: `New Test [${Math.floor(Math.random() * 1000)}]`,
          url: null,
          duration: 10,
          rate: 1,
          headers: [{ name: null, value: null }],
          scenarios: [],
        },
        errors: [],
      };
  },
    methods: {
      onClickCancel() {
        this.$router.go(-1);
      },
      onClickAddScenario() {
        this.$modal.show(ScenarioModal, {
          baseUrl: this.config.url,
          onSaved: this.onScenarioAdded,
        }, { height: 'auto' });
      },
      onScenarioAdded(scenario) {
        this.config.scenarios.push(scenario);
      },
      onScenarioEdited(newScenario, scenario) {
        const index = this.config.scenarios.findIndex(s => s === scenario);
        if (index !== -1) {
          this.config.scenarios[index] = newScenario;
        }
      },
      onClickEditScenario(scenario) {
        this.$modal.show(ScenarioModal, {
          baseUrl: this.config.url,
          onSaved: this.onScenarioEdited,
          editedScenario: scenario,
        }, { height: 'auto' });
      },
      onClickAddHeader() {
        this.config.headers.push({ name: null, value: null });
      },
      onClickRemoveHeader(index) {
        this.config.headers.splice(index, 1);
      },
      onChangeScenarioMethod(scenario, method) {
        scenario.method = method;
      },
      onClickRemoveScenario(scenario) {
        const index = this.config.scenarios.findIndex(s => s === scenario);
        if (index !== -1) {
          this.config.scenarios.splice(index, 1);
        }
      },
      hasError(field) {
        return this.errors.indexOf(field) !== -1;
      },
      isValidForm() {
        const errors = [];
        if (this.config.name.length === 0) {
          errors.push('name');
        }
        if (!this.$dvlt.validator.isValidBaseURL(this.config.url)) {
          errors.push('url');
        }
        if (this.config.duration < 1) {
          errors.push('duration');
        }
        if (this.config.rate < 1) {
          errors.push('rate');
        }

        this.errors = errors;
        return errors.length === 0;
      },
      onClickSave() {
        if (!this.isValidForm()) {
          return;
        }

        const config = this.config;
        const data = {
          id: config.id,
          name: config.name,
          url: config.url,
          duration: config.duration,
          rate: config.rate,
          headers: this.getHeaders(),
          scenarios: this.getScenarios(),
        };

        if (this.isCreate) {
          data.id = this.$dvlt.utils.guid();
          this.createConfig(data);
          this.$dvlt.notify('Config was created!');
        }
        else {
          this.$dvlt.notify('Your changes were saved!');
          this.updateConfig(data);
        }

        this.$store.dispatch('Config/selectConfig', data.id);
        this.$router.push({ name: 'test', params: { config_id: data.id } });
      },
      createConfig(data) {
        this.$store.dispatch('Config/addConfig', data);
      },
      updateConfig(data) {
        this.$store.dispatch('Config/updateConfig', {
          id: this.configId,
          data,
        });
      },
      getHeaders() {
        return this.config.headers.filter((header) => {
          return header.name && header.value;
        });
      },
      getScenarios() {
        return this.config.scenarios.filter((scenario) => {
          return scenario.method && this.$dvlt.validator.isValidURLPath(scenario.url);
        });
      },
    },
    computed: {
      isCreate() {
        return this.configId === null;
      },
    },
    mounted() {
      const configId = this.$router.currentRoute.params.config_id;
      if (configId) {
        this.configId = configId;
        this.config = JSON.parse(JSON.stringify(this.$store.getters['Config/getConfig'](configId)));
      }
    },
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
