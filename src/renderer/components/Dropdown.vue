<template>
  <div class="dropdown">
    <button class="btn btn-transparent" @click="onClickExpand" @blur="onBlur">
      <slot name="input"></slot>
    </button>
    <ul v-if="isExpanded">
      <slot name="items"></slot>
    </ul>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
  export default {
    name: 'dropdown',
    data() {
      return {
        isExpanded: false
      }
    },
    methods: {
      onClickExpand(e) {
        e.stopPropagation()
        this.isExpanded = !this.isExpanded;
      },
      onBlur() {
        setTimeout(() => {
          this.isExpanded = false;
        }, 200);
      }
    }
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .dropdown {
    background-color: $background-color;
    cursor: pointer;
    position: relative;
    ul {
      position: absolute;
      list-style-type: none;
      background-color: $background-color;
      padding: 0;
      margin: -2px 0 0 0;
      min-width: 150px;
      max-height: 200px;
      overflow: scroll;
      right: 0;
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
  }

</style>
