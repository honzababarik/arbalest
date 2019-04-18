<template>
  <div class="panel" :class="getCssClass">
    <div class="panel-header no-select" ref="header" @click="onClickHeader">
      <slot name="header">
        <div class="d-flex">
          <div>{{header}}</div>
          <div class="search-group">
            <span v-if="search.query && search.matches > 0">{{search.index + 1}} of {{search.matches}}</span>
            <span v-if="search.query && search.matches === 0">No matches</span>
            <input
              class="form-control form-control-xs" v-if="isSearchable"
              placeholder="Search..." v-model.trim="search.query" @click="onClickSearch" @keyup="onKeyUpSearch">
          </div>
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
  import Mark from 'mark.js';

  export default {
    props: {
      header: String,
      css: String,
      isCollapsible: { type: Boolean, default: false },
      isCollapsed: { type: Boolean, default: false },
      isSearchable: { type: Boolean, default: false },
    },
    data() {
      return {
        search: {
          index: 0,
          query: null,
          matches: 0,
          $results: [],
        },
        isExpanded: !this.isCollapsed,
        marker: null,
      };
    },
    methods: {
      onClickHeader() {
        if (!this.isCollapsible) {
          return;
        }
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
          this.scroll();
          this.registerMarker();
        }
        else {
          this.resetSearch();
        }
      },
      scroll() {
        if (this.$refs.body) {
          this.$nextTick(() => {
            this.$refs.body.scrollTop = this.$refs.body.scrollHeight - this.$refs.body.clientHeight;
          });
        }
      },
      resetSearch() {
        this.search = {
          index: 0,
          query: null,
          matches: 0,
          $results: [],
        };
        if (this.marker) {
          this.marker.unmark();
        }
      },
      registerMarker() {
        this.resetSearch();
        this.$nextTick(() => {
          if (this.isSearchable) {
            this.marker = new Mark(this.$refs.body);
          }
        });
      },
      onKeyUpSearch(e) {
        if (e.keyCode === this.$dvlt.consts.KEY_ENTER) {
          if (this.search.matches > this.search.index + 1) {
            this.focusOnSearchedItem(this.search.index + 1);
          }
          else {
            this.focusOnSearchedItem(0);
          }
        }
      },
      onClickSearch(e) {
        e.stopPropagation();
      },
      onSearchDone(count) {
        this.search.$results = this.$refs.body.getElementsByTagName('mark');
        this.search.matches = count;
        this.focusOnSearchedItem(0);
      },
      focusOnSearchedItem(newIndex) {
        const $previousMark = this.search.$results[this.search.index];
        const $newMark = this.search.$results[newIndex];
        if ($previousMark) {
          $previousMark.classList.remove('active');
        }
        if ($newMark) {
          $newMark.classList.add('active');
          this.$refs.body.scrollTop = $newMark.offsetTop;
        }
        this.search.index = newIndex;
      },
      markSearch(query) {
        if (this.marker) {
          this.marker.unmark({
            done: () => {
              this.marker.mark(query, {
                done: this.onSearchDone,
                noMatch: () => this.onSearchDone(0),
              });
            },
          });
        }
      },
    },
    watch: {
      'search.query'(newQuery) {
        this.markSearch(newQuery);
      },
    },
    computed: {
      getCssClass() {
        const css = this.isExpanded ? '' : 'collapsed';
        return `${css} ${this.css}`;
      },
      hasFooter() {
        return !!this.$slots.footer;
      },
    },
    mounted() {
      this.registerMarker();
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .panel {
    flex: 1;
    display: flex;
    overflow: auto;
    flex-direction: column;
    .panel-header {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      cursor: pointer;
      font-size: 12px;
      border-bottom: 2px solid $theme-color;
      padding: 10px;
      text-transform: uppercase;
      background-color: $panel-header-color;
    }
    .panel-body {
      flex: 1;
      overflow: scroll;
      background-color: $panel-body-color;
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }
    .panel-footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid $border-color;
      padding: 15px 10px 15px 10px;
      background-color: $panel-footer-color;
      .btn {
        padding: 8px 12px;
        font-size: 13px;
      }
    }
    &.collapsed {
      flex: initial !important;
      height: 50px;
    }

    &.panel-terminal {
      .panel-header {
        .form-control {
          width: 250px;
        }
      }
      .panel-body {
        position: relative;
        font-family: Consolas, monospace;
        white-space: pre-wrap;
        font-size: 14px;
        padding: 15px 10px;
        word-break: break-all;
      }
    }
  }

  mark {
    border-radius: 4px;
    &.active {
      background-color: $warning-color;
    }
  }

  .search-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      text-transform: initial;
      margin-right: 10px;
      color: $text-color-dark;
    }
  }

</style>
