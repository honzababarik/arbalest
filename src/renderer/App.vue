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

  import { remote, ipcRenderer } from 'electron';
  import { setInterval, clearInterval } from 'timers';
  import os from 'os-utils';

  import Tests from './views/TestsView';
  import EnvironmentDropdown from './components/EnvironmentDropdown';
  import SettingsModal from './views/SettingsModal';
  import EnvironmentModal from './views/EnvironmentModal';
  import Artillery from './components/Artillery';

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
        isSettingsOpened: false,
        measurementId: null,
      };
    },
    methods: {
      onClickSettings() {
        if (!this.isSettingsOpened) {
          this.$modal.show(SettingsModal, {}, { height: 'auto' }, {
            'before-close': this.onSettingsClosed
          });
          this.isSettingsOpened = true
        }
      },
      onSettingsClosed() {
        this.isSettingsOpened = false
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
        this.memory.perc = (1 - this.memory.used / this.memory.total) * 100;
      },
      startMeasurement() {
        this.stopMeasurement();
        this.measurementId = setInterval(this.onMeasurement, 2000);
      },
      stopMeasurement() {
        clearInterval(this.measurementId);
      },
      onOpenPreferences() {
        this.onClickSettings()
      }
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
      ipcRenderer.removeListener('open-preferences');
    },
    mounted() {
      this.onMeasurement();
      ipcRenderer.on('open-preferences', this.onOpenPreferences);
    },
  };

</script>

<style lang="scss">

  @import "./styles/vars.scss";

  #app {
    width: 100vw;
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    color: white;
    overflow: hidden;
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

</style>
