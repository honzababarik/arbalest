<template>
  <div class="scenario-list-item">
    <Icon icon="grip-lines" class="handle right-sm color-text-dark" />
    <button class="btn btn-xs right-sm" :class="getButtonClass">{{scenario.method}}</button>
    <span class="form-control form-control-sm disabled" v-if="baseUrl">{{baseUrl}}</span>
    <input class="form-control form-control-sm flex-4" type="text" v-model.trim="scenario.url" placeholder="URL" disabled>
    <button class="btn left-sm btn-xs" @click="onClickEdit" v-tooltip="'Edit Scenario'">
      <Icon icon='pen' />
    </button>
    <button class="btn left-sm btn-xs" @click="onClickRemove" v-tooltip="'Remove Scenario'">
      <Icon icon='trash-alt' />
    </button>
  </div>
</template>

<script>

  import Dropdown from './Dropdown';

  export default {
    components: {
      Dropdown,
    },
    props: {
      scenario: Object,
      baseUrl: String,
    },
    methods: {
      onClickRemove() {
        this.$emit('remove', this.scenario);
      },
      onClickEdit() {
        this.$emit('edit', this.scenario);
      },
    },
    computed: {
      getButtonClass() {
        const style = this.$dvlt.style.getMethodStyle(this.scenario.method);
        return `btn-${style}`;
      },
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .scenario-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    label {
      margin-bottom: 0;
    }
    .disabled {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      background-color: $input-border-color;
      color: $text-color-dark;
    }
    .form-control + .form-control {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
    }
  }

</style>
