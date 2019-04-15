<template>
  <div class="settings-item">
    <div class="info">
      <div class="title">{{item.title}}</div>
      <div class="subtitle">{{item.subtitle}}</div>
    </div>
    <div class="form-group">
      <input class="form-control form-control-xs" type="number" :placeholder="item.placeholder" v-model.number="currentValue" @change="onChange">
    </div>
  </div>
</template>

<script>

  export default {
    props: ['item', 'value'],
    data() {
      return {
        currentValue: null
      }
    },
    watch: {
      value(newVal, oldVal) {
        this.currentValue = newVal;
      }
    },
    methods: {
      isValidForm() {
        const errors = [];
        // Could use better validation, values should be configurable
        if (this.currentValue < 1) {
          errors.push('value')
        }
        return errors.length === 0;
      },
      onChange() {
        if (!this.isValidForm()) {
          return;
        }
        console.log('Changed!')
        this.$emit('change', this.item, this.currentValue)
      },
    }
  };

</script>


<style lang="scss">

   @import '../styles/vars.scss';

  .settings-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    .info {
      flex: 3;
    }
    .title {
      font-size: 14px;
    }
    .subtitle {
      margin-top: 3px;
      font-size: 12px;
      color: $text-color-dark;
    }
  }

</style>