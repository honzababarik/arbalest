<template>
  <div class="wrapper">
    <div class="header">
      <div class="d-flex">
        <button class="btn btn-success btn-circle right-sm" @click="onClickAdd" v-tooltip="'Add Test'">+</button>
        <h1>Tests</h1>
      </div>
      <div>
        <Dropdown css='dropdown-relative dropdown-right' @select="onDropdownSelected" :items="dropdownItems">
          <template slot="input">
            <Icon icon='ellipsis-v' />
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="content">
      <draggable @end="onStopDragging">
        <TestListItem
          v-for="test in tests" :key="test.id"
          :test="test" :is-active="selectedTestId === test.id"
          @click="onClickTest" @run="onClickRunTest" @stop="onClickStopTest">
        </TestListItem>
      </draggable>
    </div>
  </div>
</template>

<script>

import router from '@/router/';
import TestListItem from './TestListItem';
import Dropdown from './Dropdown';
import Storage from '@/../lib/storage';
import Test from '@/store/models/Test';
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';

const { dialog } = require('electron').remote;

export default {
  name: 'tests',
  components: {
    TestListItem,
    Dropdown,
    draggable,
  },
  data() {
    return {
      dropdownItems: ['Import', 'Export'],
    };
  },
  methods: {
    onClickImport() {
      dialog.showOpenDialog({
        title: 'Import Tests...',
        buttonLabel: 'Import',
        filters: [
          { name: 'Arbalest File', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      }, this.onImportFileSelected);
    },
    onClickExport() {
      const time = this.$dvlt.string.replaceAll(Date().toLocaleString(), ' ', '_');
      dialog.showSaveDialog({
        title: 'Export Tests...',
        message: 'Export',
        defaultPath: `arbalest-tests_${time}.json`,
        properties: ['createDirectory'],
        buttonLabel: 'Export',
      }, this.onExportFileSelected);
    },
    async onImportFileSelected(filePaths) {
      if (!filePaths || filePaths.length === 0) {
        return;
      }
      try {
        const tests = await new Storage().importTests(filePaths[0]);
        if (tests) {
          this.$store.dispatch('Test/importTests', tests);
          this.$dvlt.notify('Importing...');
        }
      }
      catch (err) {
        console.warn(`Import failed: ${err}`, 'danger');
      }
    },
    async onExportFileSelected(filePath) {
      try {
        const tests = this.tests.map(test => new Test(test).toJSON());
        await new Storage().exportTests(filePath, tests);
        this.$dvlt.notify(`Your tests were exported to: ${filePath}!`);
      }
      catch (err) {
        console.warn(`Export failed: ${err}`, 'danger');
      }
    },
    onDropdownSelected(index) {
      switch (index) {
        case 0: this.onClickImport(); break;
        case 1: this.onClickExport(); break;
      }
    },
    onStopDragging(e) {
      this.$store.dispatch('Test/reorderTest', {
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
      });
    },
    onClickAdd() {
      this.$store.dispatch('Test/selectTest', null);
      this.$router.push({ name: 'test-create' });
    },
    onClickTest(test) {
      this.$store.dispatch('Test/selectTest', test.id);
      this.$router.push({ name: 'test', params: { test_id: test.id } });
    },
    onClickRunTest(test) {
      this.$store.dispatch('Test/selectTest', test.id);
      this.$router.push({ name: 'test', params: { test_id: test.id } });
      this.$store.dispatch('Job/startJob', test.id);
    },
    onClickStopTest(test) {
      this.$store.dispatch('Test/selectTest', test.id);
      this.$router.push({ name: 'test', params: { test_id: test.id } });
      this.$store.dispatch('Job/stopJob', test.id);
    },
  },
  computed: {
    ...mapGetters({
      tests: 'Test/getTests',
      selectedTestId: 'Test/getSelectedTestId',
    }),
  },
};

</script>

<style lang="scss" scoped>

  @import "../styles/vars.scss";

  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $sidebar-color;
  }

  .header {
    padding: 10px 15px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $border-color;
    h1 {
      font-size: 20px;
    }
  }

  .content {
    overflow: scroll;
    flex: 1;
  }

</style>
