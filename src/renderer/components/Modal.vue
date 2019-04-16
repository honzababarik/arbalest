<template>
  <div class="modal" :class="css">
    <div class="modal-header no-select">
      <slot name="header">
        <div></div>
        <div class="title">{{header}}</div>
        <div class="text-right">
          <button class="btn btn-transparent" @click="onClickClose">
            <Icon icon='times' size='lg' />
          </button>
        </div>
      </slot>
    </div>
    <div class="modal-body">
      <slot></slot>
    </div>
    <div class="modal-footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      header: String,
      css: String,
    },
    methods: {
      onClickClose() {
        this.$emit('close');
      },
    },
    computed: {
      hasFooter() {
        return !!this.$slots.footer;
      },
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .modal {
    flex: 1;
    width: 100%;
    height: inherit;
    display: flex;
    flex-direction: column;
    color: $text-color;
    background-color: black;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $modal-header-background-color;
    border-bottom: 2px solid $theme-color;
    .btn {
      padding: 12px 16px;
    }
    div:first-child, div:last-child {
      width: 100px;
    }
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .modal-body {
    background-color: $modal-body-background-color;
    min-height: 30vh;
    max-height: 80vh;
    overflow: scroll;
  }

  .modal-footer {
    background-color: $modal-footer-background-color;
    border-top: 1px solid $border-color;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .btn {
      padding: 8px 12px;
      font-size: 13px;
    }
  }

</style>
