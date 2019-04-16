<template>
  <Modal header='Settings' @close="$emit('close')">
    <div class="tab-body">
      <Switchbox
        label='SSL Certificate Verification' name='request.doesVerifySSL'
        @toggle='onToggleRequestSettings' :is-checked='settings.request.doesVerifySSL' />
      <SettingsItem v-for="(item, i) in items" :key="i" :item="item" @change="onItemChanged" :value="getItemValue(item)" />
    </div>
  </Modal>
</template>

<script>

  import Switchbox from '@/components/Switchbox';
  import Modal from '@/components/Modal';
  import SettingsItem from '@/components/SettingsItem';

  export default {
    name: 'settings',
    components: {
      Switchbox,
      SettingsItem,
      Modal,
    },
    data() {
      return {
        currentTab: 'General',
        tabs: [
          'General',
        ],
        items: [
          {
            name: 'settings.request.timeout',
            title: 'HTTP Timeout',
            subtitle: 'Responses have to be sent within timeout or the request will be aborted',
            placeholder: 'Unlimited',
          },
          {
            name: 'settings.request.pool',
            title: 'Connection Pool',
            subtitle: 'All HTTP requests from all virtual users will be sent over the same connections',
            placeholder: 'Unlimited',
          },
        ],
      };
    },
    methods: {
      onClickSelectTab(tab) {
        this.currentTab = tab;
      },
      onToggleRequestSettings(name, value) {
        const keys = name.split('.');
        this.updateSettings(keys[keys.length - 1], value);
      },
      onItemChanged(item, value) {
        const keys = item.name.split('.');
        this.updateSettings(keys[keys.length - 1], value);
      },
      updateSettings(key, value) {
        this.$store.dispatch('Settings/changeRequestSettings', { key, value });
      },
      getItemValue(item) {
        // TODO stuff
        return null;
      },
    },
    computed: {
      settings() {
        return this.$store.getters['Settings/getSettings'];
      },
    },
  };

</script>

<style lang="scss">

  @import "../styles/vars.scss";

  .tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    .tab {
      cursor: pointer;
      flex: 1;
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid transparent;
      &.active {
        border-bottom-color: $active-color;
      }
    }
  }

  .tab-body {
    padding: 20px;
  }

</style>
