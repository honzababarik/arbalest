<template>
  <Modal header='Settings' @close="$emit('close')">
    <div class="tab-body">
      <Checkbox
        label='SSL Certificate Verification' name='request.doesVerifySSL'
        @toggle='onToggleRequestSettings' :is-checked='settings.request.doesVerifySSL' />
    </div>
  </Modal>
</template>

<script>

  import Checkbox from '@/components/Checkbox'
  import Modal from '@/components/Modal'

  export default {
    name: 'settings',
    components: {
      Checkbox,
      Modal
    },
    data() {
      return {
        currentTab: 'General',
        tabs: [
          'General'
        ]
      }
    },
    methods: {
      onClickSelectTab(tab) {
        this.currentTab = tab
      },
      onToggleRequestSettings(name, value) {
        const keys = name.split('.')
        this.$store.dispatch('Settings/changeRequestSettings', {
          key: keys[keys.length - 1],
          value: value
        })
      }
    },
    computed: {
      settings() {
        return this.$store.getters['Settings/getSettings']
      }
    }
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
