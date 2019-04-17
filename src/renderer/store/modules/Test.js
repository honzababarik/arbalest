import dvlt from '../../assets/js/core';
import Test from '../models/Test';


const state = {
  tests: [],
  selectedTestId: null,
};

const getters = {
  getTests: state => state.tests,
  getTest: state => testId => state.tests.find(t => t.id === testId),
  getSelectedTestId: state => state.selectedTestId,
};

const mutations = {
  ADD_TEST(state, test) {
    state.tests.push(test);
  },
  DELETE_TEST(state, testId) {
    const index = state.tests.findIndex(t => t.id === testId);
    if (index !== -1) {
      state.tests.splice(index, 1);
    }
  },
  SELECT_TEST(state, testId) {
    state.selectedTestId = testId;
  },
  UPDATE_TEST(state, { id, data }) {
    const index = state.tests.findIndex(t => t.id === id);
    if (index !== -1) {
      state.tests[index] = Object.assign(state.tests[index], data);
    }
  },
  REORDER_TEST(state, { oldIndex, newIndex }) {
    if (oldIndex === newIndex) {
      return;
    }
    dvlt.array.moveElement(state.tests, oldIndex, newIndex);
  },
  IMPORT_TESTS(state, tests) {
    for (let i = 0; i < tests.length; i++) {
      const data = tests[i];
      if (!data.id) {
        continue;
      }

      let newTest;
      try {
        newTest = new Test(data);
      }
      catch (err) {
        console.log(`Error parsing file: ${err}`);
        continue;
      }

      const existingTest = state.tests.find(t => t.id === data.id);
      if (existingTest) {
        newTest.mergeTo(existingTest);
      }
      else {
        state.tests.push(newTest.toJSON());
      }
    }
  },
};

const actions = {
  addTest({ commit }, test) {
    commit('ADD_TEST', test);
  },
  updateTest({ commit }, payload) {
    commit('UPDATE_TEST', payload);
  },
  reorderTest({ commit }, payload) {
    commit('REORDER_TEST', payload);
  },
  deleteTest({ commit }, testId) {
    commit('DELETE_TEST', testId);
  },
  selectTest({ commit }, testId) {
    commit('SELECT_TEST', testId);
  },
  importTests({ commit }, tests) {
    commit('IMPORT_TESTS', tests);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
