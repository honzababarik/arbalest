const moveElement = (arr, oldIndex, newIndex) => {
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
};

const state = {
  configs: [],
  selectedConfigId: null,
};

const getters = {
  getConfigs: state => state.configs,
  getConfig: state => configId => state.configs.find(c => c.id === configId),
  getSelectedConfigId: state => state.selectedConfigId,
};

const mutations = {
  ADD_CONFIG(state, config) {
    state.configs.push(config);
  },
  DELETE_CONFIG(state, configId) {
    const index = state.configs.findIndex(c => c.id === configId);
    if (index !== -1) {
      state.configs.splice(index, 1);
    }
  },
  SELECT_CONFIG(state, configId) {
    state.selectedConfigId = configId;
  },
  UPDATE_CONFIG(state, { id, data }) {
    const index = state.configs.findIndex(c => c.id === id);
    if (index !== -1) {
      state.configs[index] = Object.assign(state.configs[index], data);
    }
  },
  REORDER_CONFIG(state, { oldIndex, newIndex }) {
    if (oldIndex === newIndex) {
      return;
    }
    moveElement(state.configs, oldIndex, newIndex);
  },
};

const actions = {
  addConfig({ commit }, config) {
    commit('ADD_CONFIG', config);
  },
  updateConfig({ commit }, payload) {
    commit('UPDATE_CONFIG', payload);
  },
  reorderConfig({ commit }, payload) {
    commit('REORDER_CONFIG', payload);
  },
  deleteConfig({ commit }, configId) {
    commit('DELETE_CONFIG', configId);
  },
  selectConfig({ commit }, configId) {
    commit('SELECT_CONFIG', configId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
