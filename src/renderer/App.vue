<template>
  <div id="app">
    <notifications position="top center" />
    <div class="titlebar" :style="getTitlebarCss">
      <div></div>
      <div class="title">Arbalest
        <div class="system" v-if="shouldDisplaySysInfo">
          <span>CPU: {{cpu.toFixed(0)}}%</span>
          <span>MEM: {{memory.used.toFixed(0)}}/{{memory.total}} MB [Free: {{memory.perc.toFixed(2)}}%]</span>
        </div>
      </div>
      <div class="text-right">
        <EnvironmentDropdown
          placeholder='No Environment'
          :selectedItem="selectedEnvironment"
          :items="environments"
          display-key="name"
          @select="onClickSelectEnvironment"
          @edit="onClickEditEnvironment"
          @add="onClickAddEnvironment" />
        <button class="btn btn-transparent" @click="onClickSettings" v-tooltip.bottom="'Settings'">
          <Icon icon='cog' size='lg' />
        </button>
      </div>
    </div>
    <div class="main">
      <div class="sidebar">
        <Tests></Tests>
      </div>
      <div class="mainbar">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
    <modals-container />
    <Artillery v-for="job in jobs" :job="job" :settings="settings" :environment="selectedEnvironment" :key="job.test_id" />
  </div>
</template>

<script>

  import { remote } from 'electron';
  import { setInterval, clearInterval } from 'timers';
  import os from 'os-utils';

  import Tests from './views/TestsView';
  import EnvironmentDropdown from './components/EnvironmentDropdown';
  import SettingsModal from './views/SettingsModal';
  import EnvironmentModal from './views/EnvironmentModal';
  import Artillery from './components/Artillery';

  // TODO CPU usage must get better, free mem is not very good calculation...
  // TODO how come two scenarios after each other have different response times
  // TODO sort scenarios

  // TODO make it possible to readjust the rate/duration on the Config screen
  // TODO Test configuration more user friendly

  // TODO Create app menu + preferences

  export default {
    name: 'Arbalest',
    components: {
      Tests,
      EnvironmentDropdown,
      Artillery,
    },
    data() {
      return {
        cpu: 0,
        memory: {
          used: 0,
          total: 0,
          perc: 0,
        },
        measurementId: null,
      };
    },
    methods: {
      onClickSettings() {
        this.$modal.show(SettingsModal, {}, { height: 'auto' });
      },
      onClickSelectEnvironment(environmentId) {
        this.$store.dispatch('Environment/selectEnvironment', environmentId);
      },
      onClickEditEnvironment(environmentId) {
        this.$modal.show(EnvironmentModal, { environmentId }, {
          height: 'auto',
        });
      },
      onClickAddEnvironment() {
        this.$modal.show(EnvironmentModal, {}, {
          height: 'auto',
        });
      },
      async onMeasurement() {
        os.cpuUsage((v) => {
          this.cpu = v * 100;
        });
        this.memory.total = os.totalmem();
        this.memory.used = this.memory.total - os.freemem();
        this.memory.perc = os.freememPercentage();
      },
      startMeasurement() {
        this.stopMeasurement();
        this.measurementId = setInterval(this.onMeasurement, 2000);
      },
      stopMeasurement() {
        clearInterval(this.measurementId);
      },
    },
    watch: {
      shouldDisplaySysInfo: {
        immediate: true,
        handler(isDisplay, wasDisplay) {
          if (isDisplay && !wasDisplay) {
            this.startMeasurement();
          }
          if (!isDisplay && wasDisplay) {
            this.stopMeasurement();
          }
        },
      },
    },
    computed: {
      jobs() {
        return this.$store.getters['Job/getJobs'];
      },
      settings() {
        return this.$store.getters['Settings/getSettings'];
      },
      environments() {
        return this.$store.getters['Environment/getEnvironments'];
      },
      selectedEnvironment() {
        return this.$store.getters['Environment/getCurrentEnvironment'];
      },
      getTitlebarCss() {
        const color = this.selectedEnvironment ? this.selectedEnvironment.color : '#1fd6a6';
        return `border-bottom-color: ${color}`;
      },
      shouldDisplaySysInfo() {
        return this.settings.general.should_display_sys_info;
      },
    },
    beforeDestroy() {
      this.stopMeasurement();
    },
    mounted() {
      this.onMeasurement();
    },
  };

</script>

<style lang="scss">

  @import "./styles/vars.scss";

  @mixin form-label {
    font-size: 12px;
    text-transform: uppercase;
    color: $text-color-dark;
  }

  body {
    font-family: 'system-font', sans-serif;
    margin: 0;
    padding: 0;
    background-color: $background-color;
  }

  *:focus {
    outline: 0;
  }

  .divider-h {
    display: inline-block;
    border-left: 1px solid $border-color;
    height: 100%;
    .side-sm {
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  .form-label {
    @include form-label;
  }

  .progress {
    height: 10px;
    background-color: $progress-background-color;
    border-top: 1px solid $border-color;
    padding: 2px;
    .value {
      height: inherit;
      background-color: $progress-color;
      -webkit-transition: width 0.5s;
      transition: width 0.5s;
    }
    &.progress-sm {
      border-top: 0;
      height: 6px;
    }
  }

  .form-group {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-bottom: 10px;
    label {
      display: block;
      margin-bottom: 10px;
      @include form-label;
    }
    &.error {
      .disabled {
        border-color: $danger-color;
      }
      label {
        color: $danger-color;
      }
      input[type="text"], input[type="number"], textarea {
        border-color: $danger-color;
      }
    }
  }
  .form-control, .form-group input {
    display: block;
    font-size: 14px;
    border: 1px solid $input-border-color;
    background-color: $input-background-color;
    border-radius: $input-border-radius;
    color: white;
    padding: 10px 12px;
  }
  .form-control.form-control-xs {
    padding: 6px 8px;
    font-size: 12px;
    line-height: 15px;
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
    &.error {
      border-color: $danger-color;
    }
  }

  .d-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .flex-1 { flex: 1 }
  .flex-2 { flex: 2 }
  .flex-3 { flex: 3 }
  .flex-4 { flex: 4 }

  .right-xs { margin-right: 5px; }
  .right-sm { margin-right: 10px; }
  .right-md { margin-right: 15px; }

  .left-xs { margin-left: 5px; }
  .left-sm { margin-left: 10px; }
  .left-md { margin-left: 15px; }

  .bottom-xs { margin-bottom: 5px; }
  .bottom-sm { margin-bottom: 10px; }
  .bottom-md { margin-bottom: 15px; }

  .danger-color { color: $danger-color !important; }
  .success-color { color: $success-color !important; }
  .warning-color { color: $warning-color !important; }
  .info-color { color: $info-color !important; }

  .tag {
    padding: 4px 8px;
    text-transform: uppercase;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    background-color: $text-color-dark;
    color: white;
    &.success {
      background-color: $success-color;
    }
    &.warning {
      background-color: $warning-color;
    }
    &.danger {
      background-color: $danger-color;
    }
    &.info {
      background-color: $info-color;
    }
  }

  .no-select {
    @include no-select;
  }

  .text-right {
    text-align: right;
  }

  #app {
    width: 100vw;
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    color: white;
    overflow: hidden;
  }

  .tooltip {
    color: white;
    margin-top: 2px;
    font-size: 12px;
    background-color: $tooltip-background-color;
    border: 1px solid $tooltip-border-color;
    border-radius: 4px;
    padding: 4px 8px;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .titlebar {
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-user-select: none;
    -webkit-app-region: drag;
    height: 40px;
    border-bottom: 3px solid $theme-color;
    background-color: $titlebar-color;
    .btn {
      padding: 12px 16px;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
    & > div:first-child, & > div:last-child {
      height: inherit;
      width: 30%;
    }
    .text-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .system {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      font-size: 10px;
      color: $text-color-dark;
    }
    .title {
      display: flex;
      align-items: center;
    }
  }

  .sidebar {
    flex: 1;
    position: relative;
    border-right: 3px solid $border-color;
  }

  .mainbar {
    flex: 3;
    display: flex;
    background-color: $mainbar-color;
  }

  .v--modal {
    box-shadow: none;
    border-radius: 8px;
  }

  .v--modal-overlay {
    background: rgba(0, 0, 0, 0.7);
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px dashed $border-color;
  }

  .btn {
    border: 0;
    padding: 12px 8px;
    font-size: 16px;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    background-color: $button-color;
    &:hover {
      color: $text-color-dark;
    }
    &.btn-success {
      background-color: $success-color;
    }
    &.btn-info {
      background-color: $info-color;
    }
    &.btn-danger {
      background-color: $danger-color;
    }
    &.btn-warning {
      background-color: $warning-color;
    }
    &.btn-circle {
      border-radius: 50px;
      padding: 0;
      line-height: 19px;
      height: 30px;
      width: 30px;
      text-align: center;
      border-radius: 50px;
    }
    &.btn-transparent {
      background-color: transparent;
    }
    &.btn-xs {
      padding: 4px 6px;
      font-size: 12px;
    }
  }

</style>
