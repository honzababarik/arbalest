<template>
  <div>
    <div class="test-list-item" :data-id="test.id" :class="{'active': isActive}" @click="onClick">
      <div class="left">
        <div class="title">{{test.name}}</div>
        <div class="subtitle">{{test.url}}</div>
      </div>
      <div>
        <button class="btn btn-transparent danger-color" @click="onClickStop" v-if="isRunning" v-tooltip="'Stop Test'">
          <Icon icon='stop-circle' size='lg'></Icon>
        </button>
        <button class="btn btn-transparent" @click="onClickRun" v-else  v-tooltip="'Run Test'">
          <Icon icon='play-circle' size='lg'></Icon>
        </button>
      </div>
    </div>
    <div class="progress progress-sm" v-if="isRunning">
      <div class="value" :style="getProgressStyle"></div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex';

  export default {
    props: {
      test: Object,
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onClick() {
        this.$emit('click', this.test);
      },
      onClickRun() {
        this.$emit('run', this.test);
      },
      onClickStop() {
        this.$emit('stop', this.test);
      },
    },
    computed: {
      job() {
        return this.$store.getters['Job/getJobByTestId'](this.test.id);
      },
      isRunning() {
        return this.job && this.job.is_running;
      },
      getMaxResponses() {
        if (!this.job) {
          return 0;
        }
        return this.job.duration * this.job.rate * this.job.scenarioCount;
      },
      getProgressStyle() {
        if (this.job && this.getMaxResponses > 0) {
          const progress = Math.round(this.job.responses.length / this.getMaxResponses * 100);
          return `width: ${progress}%`;
        }
      },
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .test-list-item {
    border-bottom: 1px solid $list-item-border-color;
    cursor: pointer;
    background-color: $list-item-color;
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
