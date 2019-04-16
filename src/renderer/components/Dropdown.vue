<template>
  <div class="dropdown" :class="css">
    <button :class="inputCss" @click="onClickExpand">
      <slot name="input">
        <Icon :icon="isExpanded ? 'chevron-up' : 'chevron-down'" />
        <span class="left-xs">{{value}}</span>
      </slot>
    </button>
    <ul v-if="isExpanded">
      <slot name="items">
        <li v-for="(item, i) in items" @click="onClickItem(i)" :key="item">{{item}}</li>
      </slot>
    </ul>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  name: 'dropdown',
  props: {
    value: String,
    css: String,
    inputCss: {
      type: String,
      default: 'btn',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    onClickItem(index) {
      this.$emit('select', index, this.items[index]);
      this.isExpanded = false;
    },
    onClickExpand(e) {
      e.stopPropagation();
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .dropdown {
    cursor: pointer;
    .input {
      border-radius: $input-border-radius;
      border: 1px solid $input-border-color;
      padding: 4px 8px;
      background-color: $input-background-color;
    }
    ul {
      position: absolute;
      list-style-type: none;
      background-color: $input-background-color;
      padding: 0;
      margin: -2px 0 0 0;
      min-width: 150px;
      max-height: 200px;
      overflow: scroll;
      border: 1px solid $input-border-color;
      border-radius: $input-border-radius;
      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px 20px;
        margin: 0;
        color: $text-color;
        font-size: 14px;
        &:hover {
          background-color: $border-color;
        }
      }
    }
    &.dropdown-right {
      ul {
        right: 0;
      }
    }
    &.dropdown-relative {
      position: relative;
    }
  }

</style>
