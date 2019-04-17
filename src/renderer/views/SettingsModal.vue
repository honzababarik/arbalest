<template>
  <Modal header='Settings' @close="$emit('close')">
    <div class="tabs">
      <div class="tab" v-for="tab in tabs" :key="tab" :class="{'active': currentTab === tab}" @click="onClickSelectTab(tab)">
        {{tab}}
      </div>
    </div>
    <div class="tab-body">
      <div v-if="currentTab === 'General'">
        <Switchbox
          title='Show OS Info' name='general.should_display_sys_info'
          subtitle='Displays CPU and Memory information in the title bar'
          @toggle='onToggleGeneralSettings' :is-checked='settings.general.should_display_sys_info' />
      </div>
      <div v-if="currentTab === 'Request'">
        <Switchbox
          title='SSL Certificate Verification' name='request.does_verify_SSL'
          @toggle='onToggleRequestSettings' :is-checked='settings.request.does_verify_SSL' />
        <Switchbox
          title='Log Test Progress'
          subtitle='Display test progress output in the terminal' name='request.does_log_progress'
          @toggle='onToggleRequestSettings' :is-checked='settings.request.does_log_progress' />
        <SettingsItem v-for="(item, i) in requestItems" :key="i" :item="item" @change="onItemChanged" :value="getItemValue(item)" />
      </div>
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
          'Request'
        ],
        requestItems: [
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
      onToggleGeneralSettings(name, value) {
        const keys = name.split('.');
        this.updateSettings(keys[keys.length - 1], value, 'changeGeneralSettings');
      },
      onItemChanged(item, value) {
        this.updateSettings(this.getItemKey(item), value);
      },
      updateSettings(key, value, method = 'changeRequestSettings') {
        this.$dvlt.notify('Your settings were updated!');
        this.$store.dispatch(`Settings/${method}`, { key, value });
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
    margin: 15px 15px 0 15px;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    border: 1px solid $border-color;
    .tab {
      cursor: pointer;
      flex: 1;
      text-align: center;
      padding: 10px 0;
      border-bottom: 2px solid transparent;
      &.active {
        border-bottom-color: $active-color;
      }
    }
  }

  .tab-body {
    margin: 0 15px 15px 15px;
    padding: 15px;
    border: 1px solid $border-color;
    border-top: 0;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }

</style>
