<template>
  <div class="wrapper">
    <div class="header">
      <div class="d-flex">
        <button class="btn btn-success btn-circle right-sm" @click="onClickAdd">+</button>
        <h1>Configs</h1>
      </div>
      <div>
        <button class="btn" @click="onClickMenu">
          <font-awesome-icon icon='ellipsis-v'></font-awesome-icon>
        </button>
      </div>
    </div>
    <div class="content">
      <ConfigListItem
        v-for="config in configs" :key="config.id"
        :config="config" :is-active="selectedConfigId === config.id"
        @click="onClickConfig" @run="onClickRunConfig">
      </ConfigListItem>
    </div>
  </div>
</template>

<script>

  import router from '@/router/';
  import ConfigListItem from './ConfigListItem'
  import { mapGetters } from 'vuex'

  export default {
    name: 'configs',
    components: {
      ConfigListItem
    },
    data() {
      return {

      };
    },
    methods: {
      onClickMenu() {

      },
      onClickAdd() {
        this.$store.dispatch('Config/selectConfig', null)
        this.$router.push({ name: 'config-create' })
      },
      onClickConfig(config) {
        this.$store.dispatch('Config/selectConfig', config.id)
        this.$router.push({ name: 'config', params: { config_id: config.id } })
      },
      onClickRunConfig(config) {
        this.$store.dispatch('Config/selectConfig', config.id)
        this.$router.push({ name: 'config', params: { config_id: config.id, action: 'run' } })
      }
    },
    computed: {
      ...mapGetters({
        configs: 'Config/getConfigs',
        selectedConfigId: 'Config/getSelectedConfigId'
      })
    }
  };

</script>

<style lang="scss" scoped>

  @import "../styles/vars.scss";

  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
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

  .content {
    overflow: scroll;
    flex: 1;
  }

</style>
