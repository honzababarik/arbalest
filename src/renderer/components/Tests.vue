<template>
  <div class="wrapper">
    <div class="header">
      <div class="d-flex">
        <button class="btn btn-success btn-circle right-sm" @click="onClickAdd">+</button>
        <h1>Tests</h1>
      </div>
      <div>
        <Dropdown>
          <template slot="input">
            <Icon icon='ellipsis-v' />
          </template>
          <template slot="items">
            <li @click="onClickImport">Import...</li>
            <li @click="onClickExport">Export...</li>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="content">
      <TestListItem
        v-for="config in configs" :key="config.id"
        :config="config" :is-active="selectedConfigId === config.id"
        @click="onClickConfig" @run="onClickRunConfig" @stop="onClickStopConfig">
      </TestListItem>
    </div>
  </div>
</template>

<script>

  import router from '@/router/';
  import TestListItem from './TestListItem'
  import Dropdown from './Dropdown'
  import { mapGetters } from 'vuex'

  export default {
    name: 'configs',
    components: {
      TestListItem,
      Dropdown
    },
    methods: {
      onClickImport() {
        // TODO import configs in JSON
      },
      onClickExport() {
        // TODO export configs to JSON
      },
      onClickAdd() {
        this.$store.dispatch('Config/selectConfig', null)
        this.$router.push({ name: 'test-create' })
      },
      onClickConfig(config) {
        this.$store.dispatch('Config/selectConfig', config.id)
        this.$router.push({ name: 'test', params: { config_id: config.id } })
      },
      onClickRunConfig(config) {
        this.$store.dispatch('Config/selectConfig', config.id)
        this.$router.push({ name: 'test', params: { config_id: config.id } })
        this.$store.dispatch('Job/startJob', config.id)
      },
      onClickStopConfig(config) {
        this.$store.dispatch('Config/selectConfig', config.id)
        this.$router.push({ name: 'test', params: { config_id: config.id } })
        this.$store.dispatch('Job/stopJob', config.id)
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
