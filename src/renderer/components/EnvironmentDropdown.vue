<template>
  <div class="dropdown-environment">
    <div class="input" @click="onClickInput">
      <button class="btn btn-transparent" @click="onClickAddItem">
        <Icon :icon="selectedItem ? 'pen' : 'plus'" />
      </button>
      <div class="color" :style="getItemColorStyle(selectedItem)"></div>
      <div class="title">
        {{selectedItem ? selectedItem[displayKey] : placeholder}}
      </div>
      <button class="btn btn-transparent" v-if="hasItems">
        <Icon :icon='getChevronIcon' />
      </button>
    </div>
    <ul class="items" v-if="hasItems && isExpanded">
      <li class="item" v-for="(item, id) in displayItems" :key="item[idKey]" @click="onClickItem(id)">
        <button class="btn btn-transparent" @click="onClickEditItem(id, $event)">
          <Icon :icon="id == 0 ? 'plus' : 'pen'" />
        </button>
        <div class="color" :style="getItemColorStyle(item)"></div>
        <div class="title">{{item[displayKey]}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'environment_dropdown',
    props: {
      items: {
        type: Object,
        default: () => {},
      },
      placeholder: String,
      selectedItem: Object,
      displayKey: {
        type: String,
        value: 'id',
      },
      idKey: {
        type: String,
        value: 'id',
      },
    },
    data() {
      return {
        isExpanded: false,
      };
    },
    computed: {
      getChevronIcon() {
        return this.isExpanded ? 'chevron-up' : 'chevron-down';
      },
      hasItems() {
        return Object.keys(this.items).length > 0;
      },
      displayItems() {
        const item = {
          name: 'No Environment',
          color: 'transparent',
          variables: [],
        };
        return Object.assign({ 0: item }, this.items);
      },
    },
    methods: {
      onClickExpand(e) {
        e.stopPropagation();
        this.isExpanded = !this.isExpanded;
      },
      onClickItem(itemId) {
        this.$emit('select', itemId == 0 ? null : itemId);
        this.isExpanded = false;
      },
      onClickEditItem(itemId, e) {
        e.stopPropagation();
        if (itemId == 0) {
          this.$emit('add');
        }
        else {
          this.$emit('edit', itemId);
        }
        this.isExpanded = false;
      },
      onClickAddItem(e) {
        e.stopPropagation();
        if (this.selectedItem) {
          this.$emit('edit', this.selectedItem.id);
        }
        else {
          this.$emit('add');
        }
        this.isExpanded = false;
      },
      onClickInput(e) {
        this.onClickExpand(e);
      },
      getItemColorStyle(item) {
        const color = item ? item.color : 'transparent';
        return `background-color: ${color}`;
      },
    },
  };
</script>


<style lang="scss">

  @import "../styles/vars.scss";

  .dropdown-environment {
    background-color: $input-background-color;
    cursor: pointer;
    position: relative;
    .color {
      margin-left: 10px;
      border-radius: 50%;
      height: 15px;
      width: 15px;
      border: 1px solid $border-color;
    }
    .title {
      margin: 0 10px;
      white-space: nowrap;
      width: 150px;
      text-align: left;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .input {
      border-radius: $input-border-radius;
      border: 1px solid $input-border-color;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: $text-color-dark;
      font-size: 13px;
    }
    .items {
      position: absolute;
      list-style-type: none;
      background-color: $input-background-color;
      padding: 0;
      margin: -2px 0 0 0;
      left: 0;
      right: 0;
      top: 0;
      max-height: 210px;
      overflow: scroll;
      border: 1px solid $input-border-color;
      border-radius: $input-border-radius;
      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 2px 0;
        margin: 0;
        color: $text-color;
        font-size: 13px;
        &:hover {
          background-color: $border-color;
        }
      }
    }
    .btn {
      padding: 6px 10px !important;
      width: 40px;
      text-align: center;
    }
  }

</style>
