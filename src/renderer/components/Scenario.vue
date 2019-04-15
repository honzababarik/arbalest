<template>
  <div class="scenario">
    <div class="header">
      <Dropdown :value='scenario.method' input-css="btn btn-input btn-xs" :items="methods" @select="onSelectMethod"></Dropdown>
      <input class="form-control form-control-xs flex-4 left-sm" type="text" v-model.trim="scenario.url" placeholder="URL">
      <button class="btn btn-success left-sm btn-xs" v-if="canAddBody" @click="onClickBody">Body</button>
      <button class="btn left-sm btn-xs" @click="onClickRemove">Remove</button>
    </div>
    <div class="body" v-if="isExpanded">
      <div class="d-flex bottom-sm">
        <label>Body</label>
        <Dropdown :items="contentTypes" :value="scenario.contentType" css="dropdown-relative dropdown-right" input-css="btn btn-input btn-xs" @select="onSelectContentType" />
      </div>
      <textarea v-if="isRawInput" rows="4" v-model="scenario.body"></textarea>
      <div v-else>
        <div class="d-flex bottom-sm" v-for="(value, i) in scenario.data" :key="i">
          <input class="form-control form-control-xs flex-1" type="text" v-model.trim="value.name" placeholder="Name">
          <input class="form-control form-control-xs flex-1 left-sm" type="text" v-model.trim="value.value" placeholder="Value">
          <button class="btn left-sm btn-xs" @click="onClickRemoveData(i)">Remove</button>
        </div>
        <button class="btn btn-xs" @click="onClickAddData">Add</button>
      </div>
    </div>
  </div>
</template>

<script>

  import Dropdown from './Dropdown';

  export default {
    components: {
      Dropdown
    },
    props: {
      scenario: Object
    },
    data() {
      return {
        methods: this.$dvlt.data.httpMethods,
        contentTypes: this.$dvlt.data.contentTypes,
        isExpanded: false
      }
    },
    methods: {
      onClickRemove() {
        this.$emit('remove', this.scenario)
      },
      onSelectMethod(index, method) {
        this.$emit('method', this.scenario, method)
      },
      onClickBody() {
        this.isExpanded = !this.isExpanded;
      },
      onClickRemoveData(i) {
        // TODO remove data from index
      },
      onClickAddData() {
        // TODO push new data
      },
      onSelectContentType(i) {
        // TODO select this.contentTypes[i]
      }
    },
    computed: {
      isRawInput() {
        return this.scenario.contentType === 'application/json'
      },
      canAddBody() {
        return this.scenario.method !== 'GET'
      }
    }
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .scenario {
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      label {
        margin-bottom: 0;
      }
    }
    .body {
      padding: 10px 0;
      label {
        margin-bottom: 0;
      }
    }
    textarea {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      resize: none;
      border: 1px solid $input-border-color;
      border-radius: $input-border-radius;
      background-color: $input-background-color;
      color: white;
      font-family: Consolas, monospace;
      white-space: pre-wrap;
      font-size: 14px;
      padding: 15px 10px;
      word-break: break-all;
    }
    .dropdown ul li {
      font-size: 12px;
      padding: 10px;
    }
  }

</style>
