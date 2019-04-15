<template>
  <div class="form-check">
    <input type="checkbox" :checked="isChecked" :value="isChecked" :id="name" @change="onChange">
    <label class="label" :for="name">{{label}}</label>
  </div>
</template>

<script>
  export default {
    name: 'checkbox',
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

  .form-check {
    @include no-select;
    &:hover .label:before {
      background: $theme-color;
    }
    input {
      position: absolute;
      opacity: 0;

      &:focus + .label:before {
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
      }

      &:checked + .label:before {
        background: $theme-color;
      }

      &:disabled + .label {
        color: $disabled-color;
        cursor: auto;
      }

      &:disabled + .label:before {
        box-shadow: none;
        background: $disabled-background-color;
      }

      &:checked + .label:after {
        content: '';
        position: absolute;
        left: 5px;
        top: 9px;
        background: white;
        width: 2px;
        height: 2px;
        box-shadow:
          2px 0 0 white,
          4px 0 0 white,
          4px -2px 0 white,
          4px -4px 0 white,
          4px -6px 0 white,
          4px -8px 0 white;
        transform: rotate(45deg);
      }
    }
    .label {
      color: $text-color;
      text-transform: none;
      font-size: 14px;
      position: relative;
      cursor: pointer;
      &:before {
        content: '';
        border: 1px solid $border-color;
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        background: $background-color-dark;
        border-radius: 4px;
      }
    }
  }

</style>
