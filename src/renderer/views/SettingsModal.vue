<template>
  <Modal header='Settings' @close="$emit('close')">
    <div class="tab-body">
      <Switchbox
        title='SSL Certificate Verification' name='request.does_verify_SSL'
        @toggle='onToggleRequestSettings' :is-checked='settings.request.does_verify_SSL' />
      <Switchbox
        title='Log Test Progress'
        subtitle='Display test progress output in the terminal' name='request.does_log_progress'
        @toggle='onToggleRequestSettings' :is-checked='settings.request.does_log_progress' />
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
            name: 'request.timeout',
            title: 'HTTP Timeout',
            subtitle: 'Responses have to be sent within timeout in seconds or the request will be aborted',
            placeholder: 'Unlimited',
          },
          {
            name: 'request.pool',
            title: 'Connection Pool',
            subtitle: 'All HTTP requests from all virtual users will be sent over the same connections',
            placeholder: 'Unlimited',
          },
        ],
      };
    },
    methods: {
      getItemKey(item) {
        const keys = item.name.split('.');
        return keys[keys.length - 1];
      },
      onClickSelectTab(tab) {
        this.currentTab = tab;
      },
      onToggleRequestSettings(name, value) {
        const keys = name.split('.');
        this.updateSettings(keys[keys.length - 1], value);
      },
      onItemChanged(item, value) {
        this.updateSettings(this.getItemKey(item), value);
      },
      updateSettings(key, value) {
        this.$dvlt.notify('Your settings were updated!');
        this.$store.dispatch('Settings/changeRequestSettings', { key, value });
      },
      getItemValue(item) {
        return this.settings.request[this.getItemKey(item)];
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
