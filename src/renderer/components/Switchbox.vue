<template>
  <div class="form-switch">
    <label>{{label}}</label>
    <label class="switch">
      <input type="checkbox" :checked="isChecked" :value="isChecked" :id="name" @change="onChange">
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'switchbox',
    props: {
      name: {
        type: String,
      },
      label: {
        type: String,
      },
      isChecked: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onChange() {
        this.$emit('toggle', this.name, !this.isChecked);
      },
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  $switch-height: 26px;
  $switch-padding: 4px;
  $switch-width: 2 * ($switch-height - $switch-padding);
  $toggle-size: $switch-height - 2 * $switch-padding;

  .form-switch {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .switch {
      position: relative;
      display: inline-block;
      width: $switch-width;
      height: $switch-height;
      input {
        opacity: 0;
        width: 0;
        height: 0;
      }
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: $input-background-color;
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: $switch-height;
      &:before {
        position: absolute;
        content: "";
        height: $toggle-size;
        width: $toggle-size;
        left: $switch-padding;
        bottom: $switch-padding;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
      }
    }
    input:checked + .slider {
      background-color: $theme-color;
    }
    input:checked + .slider:before {
      -webkit-transform: translateX($toggle-size);
      -ms-transform: translateX($toggle-size);
      transform: translateX($toggle-size);
    }
  }

</style>
