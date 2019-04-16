<template>
  <div class="response">
    <div class="main" @click="onClick">
      <div class="info">
        <div class="tag" :class="getMethodTagCss">{{response.method}}</div>
        <div class="tag" :class="getStatusTagCss">{{response.status}}</div>
        <div class="url">{{response.url}}</div>
      </div>
      <div>
        <div class="time">{{response.time}}ms</div>
      </div>
    </div>
    <div class="side" v-if="isExpanded">
      <label class="form-label">Content Type</label>
      <pre>{{response.content_type}}</pre>
      <div v-if="response.data">
        <label class="form-label">Body</label>
        <pre>{{getData}}</pre>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      response: Object,
    },
    data() {
      return {
        isExpanded: false,
      };
    },
    methods: {
      onClick() {
        this.isExpanded = !this.isExpanded;
      },
    },
    computed: {
      getData() {
        return JSON.parse(this.response.data);
      },
      getMethodTagCss() {
        return this.$dvlt.style.getMethodStyle(this.response.method);
      },
      getStatusTagCss() {
        const status = this.response.status;
        if (status >= 200 && status < 300) {
          return 'success';
        }
        if (status >= 400 && status < 500) {
          return 'warning';
        }
        if (status >= 500) {
          return 'danger';
        }
        return '';
      },
    },
  };

</script>


<style lang="scss" scoped>

   @import '../styles/vars.scss';

  .response {
    border-bottom: 1px solid $list-item-border-color;
    .main {
      cursor: pointer;
      background-color: $list-item-color;
      padding: 15px;
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: space-between;
      align-items: center;
    }
    .side {
      padding: 10px 15px;
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      overflow: hidden;
    }
    .tag {
      margin-right: 10px;
    }
    .url {
      font-size: 13px;
    }
    .time {
      color: $text-color-dark;
      font-size: 12px;
    }
  }

</style>