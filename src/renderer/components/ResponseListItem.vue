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
      <label>Body</label>
      <pre>{{getData}}</pre>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      response: Object
    },
    data: function () {
      return {
        isExpanded: false
      }
    },
    methods: {
      onClick() {
        this.isExpanded = !this.isExpanded
      }
    },
    computed: {
      getData: function () {
        return JSON.parse(this.response.data)
      },
      getMethodTagCss: function () {
        switch (this.response.method) {
          case 'GET':
            return 'success'
          case 'POST':
            return 'warning'
          case 'PATCH':
          case 'PUT':
            return 'info'
          case 'DELETE':
            return 'danger'
          default: return ''
        }
      },
      getStatusTagCss: function () {
        const status = this.response.status
        if (status >= 200 && status < 300) {
          return 'success'
        }
        if (status >= 400 && status < 500) {
          return 'warning'
        }
        if (status >= 500) {
          return 'danger'
        }
        return ''
      },
    }
  };

</script>


<style lang="scss">

   @import '../styles/vars.scss';

  .response {
    border-bottom: 1px solid $background-color;
    .main {
      cursor: pointer;
      background-color: $gray-color;
      padding: 15px;
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: space-between;
    }
    .side {
      padding: 10px 15px;
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .tag {
      margin-right: 10px;
    }
    .time {
      color: $text-color-dark;
      font-size: 14px;
    }
  }

</style>