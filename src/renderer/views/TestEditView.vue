<template>

  <Panel :header="isCreate ? 'Create Test' : 'Edit Test'" css='panel-test'>
    <div class="form-group" :class="{'error': this.hasError('name')}">
      <label>Name</label>
      <input type="text" v-model.trim="test.name" placeholder="New Load Test">
    </div>
    <div class="form-group" :class="{'error': this.hasError('url')}">
      <label>URL</label>
      <input type="text" v-model.trim="test.url" placeholder="https://example.com">
    </div>
    <div class="d-flex">
      <div class="form-group right-sm" :class="{'error': this.hasError('duration')}">
        <label>Duration (in seconds)</label>
        <input type="number" v-model.number="test.duration">
      </div>
      <div class="form-group left-sm" :class="{'error': this.hasError('rate')}">
        <label>Rate</label>
        <input type="number" v-model.number="test.rate">
      </div>
    </div>

    <hr>

    <div class="form-group" :class="{'error': this.hasError('headers')}">
      <label>Headers</label>
      <div class="d-flex bottom-sm" v-for="(header, i) in test.headers" :key="i">
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
        v-for="(scenario, i) in test.scenarios" :key="i" :scenario="scenario" :base-url="test.url"
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
  import Panel from '@/components/Panel';
  import ScenarioListItem from '@/components/ScenarioListItem';
  import ScenarioModal from './ScenarioModal';

  export default {
    components: {
      Panel,
      ScenarioListItem,
    },
    data() {
      return {
        testId: null,
        test: {
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
          baseUrl: this.test.url,
          onSaved: this.onScenarioAdded,
        }, { height: 'auto' });
      },
      onScenarioAdded(scenario) {
        this.test.scenarios.push(scenario);
      },
      onScenarioEdited(newScenario, scenario) {
        const index = this.test.scenarios.findIndex(s => s === scenario);
        if (index !== -1) {
          this.test.scenarios[index] = newScenario;
        }
      },
      onClickEditScenario(scenario) {
        this.$modal.show(ScenarioModal, {
          baseUrl: this.test.url,
          onSaved: this.onScenarioEdited,
          editedScenario: scenario,
        }, { height: 'auto' });
      },
      onClickAddHeader() {
        this.test.headers.push({ name: null, value: null });
      },
      onClickRemoveHeader(index) {
        this.test.headers.splice(index, 1);
      },
      onChangeScenarioMethod(scenario, method) {
        scenario.method = method;
      },
      onClickRemoveScenario(scenario) {
        const index = this.test.scenarios.findIndex(s => s === scenario);
        if (index !== -1) {
          this.test.scenarios.splice(index, 1);
        }
      },
      hasError(field) {
        return this.errors.indexOf(field) !== -1;
      },
      isValidForm() {
        const errors = [];
        if (this.test.name.length === 0) {
          errors.push('name');
        }
        if (!this.$dvlt.validator.isValidBaseURL(this.test.url)) {
          errors.push('url');
        }
        if (this.test.duration < 1) {
          errors.push('duration');
        }
        if (this.test.rate < 1) {
          errors.push('rate');
        }

        this.errors = errors;
        return errors.length === 0;
      },
      onClickSave() {
        if (!this.isValidForm()) {
          return;
        }

        const test = this.test;
        const data = {
          id: test.id,
          name: test.name,
          url: test.url,
          duration: test.duration,
          rate: test.rate,
          headers: this.getHeaders(),
          scenarios: this.getScenarios(),
        };

        if (this.isCreate) {
          data.id = this.$dvlt.utils.guid();
          this.createTest(data);
          this.$dvlt.notify('Test was created!');
        }
        else {
          this.$dvlt.notify('Your changes were saved!');
          this.updateTest(data);
        }

        this.$store.dispatch('Test/selectTest', data.id);
        this.$router.push({ name: 'test', params: { test_id: data.id } });
      },
      createTest(data) {
        this.$store.dispatch('Test/addTest', data);
      },
      updateTest(data) {
        this.$store.dispatch('Test/updateTest', {
          id: this.testId,
          data,
        });
      },
      getHeaders() {
        return this.test.headers.filter((header) => {
          return header.name && header.value;
        });
      },
      getScenarios() {
        return this.test.scenarios.filter((scenario) => {
          return scenario.method && this.$dvlt.validator.isValidURLPath(scenario.url);
        });
      },
    },
    computed: {
      isCreate() {
        return this.testId === null;
      },
    },
    mounted() {
      const testId = this.$router.currentRoute.params.test_id;
      if (testId) {
        this.testId = testId;
        this.test = JSON.parse(JSON.stringify(this.$store.getters['Test/getTest'](testId)));
      }
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .panel-test {
    .panel-body {
      flex: 1;
      padding: 15px 10px;
    }
  }

</style>
