<template>
  <Modal :header='header' @close="$emit('close')">
    <div class="scenario">
      <div class="form-group header" :class="{'error': hasError('url')}">
        <Dropdown :value='scenario.method' :input-css="getMethodInputStyle" :items="methods" @select="onSelectMethod"></Dropdown>
        <span class="form-control form-control-sm disabled" v-if="baseUrl">{{baseUrl}}</span>
        <input class="form-control form-control-sm flex-4" type="text" v-model.trim="scenario.url" placeholder="URL">
      </div>
      <div class="body" v-if="canAddBody">
        <div class="d-flex bottom-sm">
          <label class="label">Body</label>
          <Dropdown :items="contentTypes" :value="scenario.content_type" css="dropdown-right" input-css="btn btn-input btn-xs" @select="onSelectContentType" />
        </div>
        <textarea class="form-control" v-if="isRawInput" rows="12" v-model="body" :class="{'error': hasError('body')}" @keydown="onKeyDownBody"></textarea>
        <div v-else>
          <div class="d-flex bottom-sm" v-for="(value, i) in scenario.form" :key="i">
            <input class="form-control form-control-sm flex-1" type="text" v-model.trim="value.name" placeholder="Name">
            <input class="form-control form-control-sm flex-1 left-sm" type="text" v-model.trim="value.value" placeholder="Value">
            <button class="btn left-sm btn-xs" @click="onClickRemoveData(i)">Remove</button>
          </div>
          <button class="btn btn-info btn-xs" @click="onClickAddForm">Add</button>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div>
        <button class="btn" @click="onClickCancel">Cancel</button>
      </div>
      <button class="btn btn-success" @click="onClickSave">
        {{isCreate ? 'Create' : 'Save'}}
      </button>
    </template>
  </Modal>
</template>

<script>

  import Modal from '../components/Modal';
  import Dropdown from '../components/Dropdown';

  export default {
    name: 'scenario_modal',
    components: {
      Modal,
      Dropdown,
    },
    props: ['baseUrl', 'editedScenario', 'onSaved'],
    data() {
      return {
        errors: [],
        scenario: this.getNewScenario(),
        body: null,
        methods: this.$dvlt.data.httpMethods,
        contentTypes: this.$dvlt.data.contentTypes,
      };
    },
    methods: {
      onKeyDownBody(e) {
        const key = e.keyCode;
        if (key === this.$dvlt.consts.KEY_TAB) {
          e.preventDefault();
          const textarea = e.target;
          const startCursor = textarea.selectionStart;
          const endCursor = textarea.selectionEnd;
          if (startCursor === endCursor) {
            const value = textarea.value;
            const insert = '  ';
            this.body = value.substring(0, startCursor) + insert + value.substring(endCursor, value.length);
            this.$nextTick(() => {
              const newPosition = startCursor + insert.length;
              textarea.selectionStart = newPosition;
              textarea.selectionEnd = newPosition;
            });
          }
        }
      },
      getNewScenario() {
        return {
          type: 'request',
          method: 'GET',
          url: '/',
          body: null,
          content_type: this.$dvlt.data.contentTypes[0],
          form: [
            { name: null, value: null },
            { name: null, value: null },
            { name: null, value: null },
          ],
        };
      },
      onSelectMethod(index, method) {
        this.scenario.method = method;
      },
      onClickRemoveForm(i) {
        this.scenario.form.splice(i, 1);
      },
      onClickAddForm() {
        this.scenario.form.push({
          name: null,
          value: null,
        });
      },
      onSelectContentType(i) {
        this.scenario.content_type = this.contentTypes[i];
      },
      hasError(field) {
        return this.errors.indexOf(field) !== -1;
      },
      isValidForm() {
        const errors = [];

        if (!this.scenario.url || this.scenario.url.length === 0) {
          errors.push('url');
        }

        if (this.isRawInput && this.body) {
          try {
            JSON.parse(this.body);
          }
          catch (err) {
            errors.push('body');
          }
        }

        this.errors = errors;
        return errors.length === 0;
      },
      onClickSave() {
        if (!this.isValidForm()) {
          return;
        }
        if (this.onSaved) {
          this.onSaved(this.getScenario(), this.editedScenario);
        }
        this.$emit('close');
      },
      onClickCancel() {
        this.$emit('close');
      },
      getScenario() {
        const scenario = this.scenario;
        if (this.isRawInput) {
          scenario.body = this.body ? JSON.parse(this.body) : null;
          scenario.form = [];
        }
        else {
          scenario.body = null;
          scenario.form = this.getFormValues();
        }

        return scenario;
      },
      getFormValues() {
        return this.scenario.form.filter((value) => {
          return value.name && value.value;
        });
      },
    },
    computed: {
      isCreate() {
        return this.$dvlt.utils.isNil(this.editedScenario);
      },
      isRawInput() {
        return this.scenario.content_type === 'application/json';
      },
      canAddBody() {
        return this.scenario.method !== 'GET';
      },
      header() {
        return this.isCreate ? 'Add Scenario' : 'Edit Scenario';
      },
      getMethodInputStyle() {
        const color = this.$dvlt.style.getMethodStyle(this.scenario.method);
        return `btn btn-input btn-xs right-sm btn-${color}`;
      },
    },
    mounted() {
      if (this.editedScenario) {
        this.scenario = this.editedScenario;
        if (this.scenario.body) {
          this.body = JSON.stringify(this.scenario.body, null, 2);
        }
      }
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .scenario {
    padding: 15px;
    .disabled {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      background-color: $input-border-color;
      color: $text-color-dark;
      height: 15px;
    }
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      label {
        margin-bottom: 0;
      }
      .form-control + .form-control {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: 0;
      }
    }
    .body {
      padding: 10px 0;
      label {
        margin-bottom: 0;
      }
    }
    .dropdown ul li {
      font-size: 12px;
      padding: 10px;
    }
  }

</style>
