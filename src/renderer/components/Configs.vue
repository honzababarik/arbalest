<template>
  <div class="wrapper">
    <div class="header">
      <h1>Configs</h1>
      <button>+</button>
    </div>
    <div class="content">
      <Config v-for="config in configs" :key="config.id" :config="config"></Config>
    </div>
  </div>
</template>

<script>

  import Config from './Config'

  export default {
    name: 'configs',
    components: {
      Config
    },
    data() {
      return {
        configs: [{
          id: 1,
          name: 'Test Configuration',
          filename: 'testtest.yaml'
        }]
      };
    },
    methods: {
      loadConfigs() {
        // TODO
      }
    },
    computed: {

    },
    beforeDestroy() {

    },
    mounted() {
      this.loadConfigs()
    }
  };

</script>

<style lang="scss">

  @import "../styles/vars.scss";

  .wrapper {
    height: 100vh;
  }

  .header {
    padding: 10px 15px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $border-color;
    h1 {
      font-size: 20px;
    }
  }

</style>
