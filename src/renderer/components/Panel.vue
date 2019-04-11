<template>
  <div class="panel" :class="getCssClass">
    <div class="panel-header no-select" ref="header" @click="onClickHeader">
      <slot name="header">
        <div class="d-flex">
          <div>{{header}}</div>
          <input
            class="form-control form-control-xs" v-if="isSearchable"
            placeholder="Search..." v-model="search" @click="onClickSearch">
        </div>
      </slot>
    </div>
    <div class="panel-body" ref="body" v-if="isExpanded">
      <slot></slot>
    </div>
    <div class="panel-footer" v-if="hasFooter && isExpanded">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      header: String,
      css: String,
      isCollapsible: { type: Boolean, default: false },
      isSearchable: { type: Boolean, default: false },
    },
    data: function() {
      return {
        search: null,
        isExpanded: true
      };
    },
    methods: {
      onClickHeader() {
        if (!this.isCollapsible) {
          return
        }
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
          this.scroll()
        }
      },
      scroll() {
        if (this.$refs.body) {
          this.$nextTick(() => {
            this.$refs.body.scrollTop = this.$refs.body.scrollHeight - this.$refs.body.clientHeight;
          })
        }
      },
      onClickSearch(e) {
        e.stopPropagation()
      }
    },
    watch: {
      search(newValue, oldValue) {
        this.$emit('search', newValue)
      }
    },
    computed: {
      getCssClass() {
        var css = this.isExpanded ? '' : 'collapsed';
        return `${css} ${this.css}`;
      },
      hasFooter () {
        return !!this.$slots['footer']
      }
    }
  };
</script>


<style lang="scss" scoped>

  @import "../styles/vars.scss";

  .panel {
    flex: 1;
    display: flex;
    overflow: auto;
    flex-direction: column;
    background-color: $background-color;
    .panel-header {
      cursor: pointer;
      font-size: 12px;
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      padding: 15px 10px 15px 10px;
      text-transform: uppercase;
    }
    .panel-body {
      overflow: scroll;
    }
    .panel-footer {
      border-top: 1px solid $border-color;
      padding: 15px 10px 15px 10px;
    }
    & + .panel {
      border-left: 1px solid $border-color;
    }
    &.collapsed {
      flex: initial !important;
    }

    &.panel-terminal {
      .panel-header {
        .form-control {
          width: 250px;
        }
      }
      .panel-body {
        font-family: Consolas, monospace;
        white-space: pre-wrap;
        font-size: 14px;
        padding: 15px 10px;
        word-break: break-all;
      }
    }
  }

</style>
