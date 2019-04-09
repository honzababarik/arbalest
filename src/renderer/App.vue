<template>
  <div id="app">
    <div class="side">
      <Configs></Configs>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Configs from "./components/Configs";

  export default {
    name: "Arbalest",
    components: {
      Configs
    }
  };
</script>

<style lang="scss">

  @import "./styles/vars.scss";

  body {
    font-family: "system-font", sans-serif;
    margin: 0;
    padding: 0;
    background-color: $background-color;
  }

  .danger-color {
    color: $danger-color !important;
  }
  .success-color {
    color: $success-color !important;
  }
  .warning-color {
    color: $warning-color !important;
  }
  .info-color {
    color: $info-color !important;
  }

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

  label {
    font-size: 12px;
    text-transform: uppercase;
    color: $text-color-dark;
  }

  #app {
    width: 100vw;
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: row;
    color: white;
    overflow: hidden;
  }

  .side {
    flex: 1;
    border-right: 1px solid $border-color;
  }

  .main {
    flex: 3;
  }

  button {
    border: 0;
    padding:12px 8px;
    font-size: 16px;
    color: white;
    border-radius: 4px;
    background-color: #0782C5;
    cursor: pointer;
  }

  .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: $background-color;
    .panel-header {
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      padding: 15px 10px 15px 10px;
      text-transform: uppercase;
    }
    .panel-body {
      overflow: scroll;
    }
    & + .panel {
      border-left: 1px solid $border-color;
    }
  }

</style>
