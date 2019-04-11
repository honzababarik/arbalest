<template>
  <div class="config-list-item" :class="{'active': isActive}" @click="onClick">
    <div class="left">
      <div class="title">{{config.name}}</div>
      <div class="subtitle">{{config.url}}</div>
    </div>
    <div>
      <button class="btn btn-transparent" @click="onClickRun">
        <font-awesome-icon icon='play-circle' size='lg'></font-awesome-icon>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      config: Object,
      isActive: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClick() {
        this.$emit('click', this.config)
      },
      onClickRun() {
        this.$emit('run', this.config)
      }
    }
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .config-list-item {
    border-bottom: 1px solid $background-color;
    cursor: pointer;
    background-color: $gray-color;
    padding: 15px;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    .title {
      margin-bottom: 5px;
      font-size: 14px;
    }
    .subtitle {
      color: $text-color-dark;
      font-size: 12px;
    }
    &.active {
      background-color: $border-color;
    }
  }

</style>
