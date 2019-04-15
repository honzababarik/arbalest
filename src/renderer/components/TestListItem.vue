<template>
  <div class="test-list-item" :data-id="config.id" :class="{'active': isActive}" @click="onClick">
    <div class="left">
      <div class="title">{{config.name}}</div>
      <div class="subtitle">{{config.url}}</div>
    </div>
    <div>
      <button class="btn btn-transparent danger-color" @click="onClickStop" v-if="isRunning">
        <Icon icon='stop-circle' size='lg'></Icon>
      </button>
      <button class="btn btn-transparent" @click="onClickRun" v-else>
        <Icon icon='play-circle' size='lg'></Icon>
      </button>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex';

  export default {
    props: {
      config: Object,
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onClick() {
        this.$emit('click', this.config);
      },
      onClickRun() {
        this.$emit('run', this.config);
      },
      onClickStop() {
        this.$emit('stop', this.config);
      },
    },
    computed: {
      job() {
        return this.$store.getters['Job/getJobByConfigId'](this.config.id);
      },
      isRunning() {
        return this.job && this.job.is_running;
      },
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .test-list-item {
    border-bottom: 1px solid $background-color;
    cursor: pointer;
    background-color: $gray-color;
    padding: 15px;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    @include no-select;
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
