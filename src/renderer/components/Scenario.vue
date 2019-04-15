<template>
  <div class="scenario">
    <Dropdown :value='scenario.method' input-css="btn btn-input btn-xs" :items="methods" @select="onSelectMethod"></Dropdown>
    <input class="form-control form-control-xs flex-4 left-sm" type="text" v-model.trim="scenario.url" placeholder="URL">
    <button class="btn btn-success left-sm btn-xs" v-if="canAddBody" @click="onClickBody">Body</button>
    <button class="btn left-sm btn-xs" @click="onClickRemove">Remove</button>
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
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
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
      }
    },
    computed: {
      canAddBody() {
        return this.scenario.method !== 'GET'
      }
    }
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .scenario {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
  }

</style>
