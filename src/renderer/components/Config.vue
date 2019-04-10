<template>
  <div class="config">
    {{config.name}}
  </div>
</template>

<script>
  export default {
    props: {
      config: Object
    },
    data: function() {
      return {

      };
    },
    methods: {
      onClick() {

      }
    },
    computed: {
    }
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .config {
    border-bottom: 1px solid $background-color;
    cursor: pointer;
    background-color: $gray-color;
    padding: 15px;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
  }

</style>
