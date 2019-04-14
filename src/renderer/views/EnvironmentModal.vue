<template>
  <Modal :header='header' @close="$emit('close')">

    <div class="body">
      <div class="form-group" :class="{'error': this.hasError('name')}">
        <label>Name</label>
        <input type="text" v-model="environment.name" placeholder="https://google.com">
      </div>
      <div class="form-group">
        <label>Color</label>
        <div class="colors">
          <div
            v-for="color in colors" :key="color" :style='getColorStyle(color)'
            class="color" :class="{'active': environment.color === color}"
            @click="onClickSelectColor(color)"></div>
        </div>
      </div>

      <div class="form-group">
        <label>Variables</label>
        <div class="d-flex bottom-sm" v-for="(variable, i) in environment.variables" :key="i">
          <input class="form-control form-control-xs flex-1" type="text" v-model="variable.key" placeholder="Key">
          <input class="form-control form-control-xs flex-1 left-sm" type="text" v-model="variable.value" placeholder="Value">
          <button class="btn left-sm btn-xs" @click="onClickRemoveVariable(i)">Remove</button>
        </div>
      </div>
      <button class="btn btn-info btn-xs" @click="onClickAddVariable">Add Variable</button>

    </div>

    <template slot="footer">
      <div>
        <button class="btn btn-danger" @click="onClickDelete" v-if="!isCreate">Delete</button>
      </div>
      <button class="btn btn-success" @click="onClickSave">
        {{isCreate ? 'Create' : 'Save changes'}}
      </button>
    </template>
  </Modal>
</template>

<script>

  import Modal from '@/components/Modal'

  export default {
    name: 'environment',
    components: {
      Modal
    },
    props: {
      environmentId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        environment: {
          name: 'New Environment',
          color: 'transparent',
          variables: [{ key: null, value: null }]
        },
        colors: [
          '#F44336', '#E91E63', '#9C26B0', '#673AB7',
          '#3F51B5', '#2196F3', '#01A9F4', '#00BCD3',
          '#009687', '#4DAE50', '#8BC34A', '#CCDC39',
          '#FFEB3B', '#FFC106', '#FF9800', '#FF5721',
          '#795547', '#9E9E9E', '#607D8B'
        ],
        errors: []
      }
    },
    methods: {
      onClickAddVariable() {
        this.environment.variables.push({ key: null, value: null })
      },
      onClickRemoveVariable(index) {
        this.environment.variables.splice(index, 1)
      },
      createEnvironment(data) {
        this.$store.dispatch('Environment/addEnvironment', data)
        this.$dvlt.notify('Environment was created!')
        this.close()
      },
      updateEnvironment(data) {
        data.id = this.environmentId
        this.$store.dispatch('Environment/editEnvironment', data)
        this.$dvlt.notify('Your changes were saved!')
        this.close()
      },
      hasError(field) {
        return this.errors.indexOf(field) !== -1;
      },
      isValidForm() {
        const errors = []

        if (this.environment.name.length === 0) {
          errors.push('name')
        }

        this.errors = errors
        return errors.length === 0
      },
      onClickSave() {
        const environment = this.environment
        if (!this.isValidForm()) {
          return;
        }
        const data = {
          name: environment.name,
          color: environment.color,
          variables: this.getVariables()
        }
        if (this.isCreate) {
          this.createEnvironment(data)
        }
        else {
          this.updateEnvironment(data)
        }
      },
      close() {
        this.$emit('close')
      },
      onClickDelete() {
        if (confirm('Are you sure you want to delete this environment?')) {
          this.$store.dispatch('Environment/deleteEnvironment', this.environmentId)
          this.$dvlt.notify('Environment was deleted!')
          this.close()
        }
      },
      getColorStyle(color) {
        return `background-color: ${color}`
      },
      onClickSelectColor(color) {
        this.environment.color = color;
      },
      getVariables() {
        return this.environment.variables.filter(variable => {
          return variable.key && variable.value
        })
      }
    },
    computed: {
      header() {
        return this.environmentId ? `Edit: "${this.environment.name}"` : 'Create Environment'
      },
      isCreate() {
        return this.environmentId === null;
      }
    },
    mounted() {
      if (this.environmentId) {
        this.environment = JSON.parse(JSON.stringify(this.$store.getters['Environment/getEnvironmentById'](this.environmentId)))
      }
    }
  };

</script>

<style lang="scss" scoped>

  @import "../styles/vars.scss";

  .body {
    padding: 10px 15px;
  }

  .colors {
    display: flex;
    flex-direction: row;
    align-items: center;
    .color {
      border: 2px solid transparent;
      height: 15px;
      width: 15px;
      border-radius: 50%;
      cursor: pointer;
      &.active {
        border-color: white;
      }
      & + .color {
        margin-left: 10px;
      }
    }
  }

</style>
