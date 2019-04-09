<template>
  <div class="response" @click="onClick">
    <div class="info">
      <div class="label" :class="getMethodLabelCss">{{response.method}}</div>
      <div class="label" :class="getStatusLabelCss">{{response.status}}</div>
      <div class="url">{{response.url}}</div>
    </div>
    <div>
      <div class="time">{{response.time}}ms</div>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      response: Object
    },
    methods: {
      onClick() {
        // TODO expand
      }
    },
    computed: {
      getMethodLabelCss: function () {
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
      getStatusLabelCss: function () {
        const status = this.response.status
        if (status >= 200 && status < 300) {
          return 'success'
        }
        if (status >= 300 && status < 400) {
          return 'info'
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

   $border-color: rgba(64, 64, 64, 1);
   $background-color: rgba(40, 40, 40, 1);
   $gray-color: rgba(48, 48, 48, 1);
   $text-color-dark: rgba(150, 150, 150, 1);
   $navbar-height: 70px;
   $success-color: green;

  .response {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    padding: 15px;
    background-color: $gray-color;
    border-bottom: 1px solid $background-color;
    cursor: pointer;
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .label {
      margin-right: 10px;
    }
    .time {
      color: $text-color-dark;
      font-size: 14px;
    }
  }

</style>