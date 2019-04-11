<template>
  <div id="app">
    <div class="side">
      <Configs></Configs>
    </div>
    <div class="main">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

  import Configs from './components/Configs';

  export default {
    name: 'Arbalest',
    components: {
      Configs,
    },
  };

</script>

<style lang="scss">

  @import "./styles/vars.scss";

  body {
    font-family: 'system-font', sans-serif;
    margin: 0;
    padding: 0;
    background-color: $background-color;
  }

  *:focus {
    outline: 0;
  }

  .form-group {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-bottom: 10px;
    label {
      display: block;
      margin-bottom: 10px;
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
  .left-xs { margin-left: 5px; }
  .right-sm { margin-right: 10px; }
  .left-sm { margin-left: 10px; }
  .bottom-xs { margin-bottom: 5px; }
  .bottom-sm { margin-bottom: 10px; }

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
     user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
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

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px dashed $border-color;
  }

  .side {
    flex: 1;
    border-right: 3px solid $border-color;
  }

  .main {
    flex: 3;
    display: flex;
  }

  .btn {
    border: 0;
    padding:12px 8px;
    font-size: 16px;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    background-color: $gray-color;
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
