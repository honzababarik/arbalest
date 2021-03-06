<template>
  <div class="dropdown" :class="css">
    <button :class="inputCss" @click="onClickExpand">
      <slot name="input">
        <Icon :icon="displayIcon" :size="iconSize" />
        <span class="left-xs">{{value}}</span>
      </slot>
    </button>
    <ul v-if="isExpanded">
      <slot name="items">
        <li v-for="(item, i) in displayItems" @click="onClickItem(i)" :key="i">
          <hr v-if="item.name === '-'" />
          <a v-else>
            <Icon :icon="item.icon" v-if="item.icon" class="right-sm" />
            {{item.name}}
          </a>
        </li>
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
    icon: {
      type: String,
      default: null
    },
    iconSize: {
      type: String,
      default: null
    }
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
  computed: {
    displayIcon() {
      if (this.icon) {
        return this.icon;
      }
      return this.isExpanded ? 'chevron-up' : 'chevron-down';
    },
    displayItems() {
      return this.items.map(item => {
        if (typeof item === 'string') {
          return {
            name: item
          }
        }
        return item;
      })
    }
  }
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
      a {
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
      hr {
        padding: 0;
        height: 1px;
        background-color: $border-color;
        margin: 0;
        border: 0;
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
