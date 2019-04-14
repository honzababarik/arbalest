import Vue from 'vue';

const state = {
  configs: {},
  selectedConfigId: null,
};

const getters = {
  getConfigs: state => state.configs,
  getConfig: state => configId => state.configs[configId],
  getSelectedConfigId: state => state.selectedConfigId,
};

const mutations = {
  ADD_CONFIG(state, config) {
    Vue.set(state.configs, config.id, config);
  },
  DELETE_CONFIG(state, configId) {
    Vue.delete(state.configs, configId);
  },
  SELECT_CONFIG(state, configId) {
    state.selectedConfigId = configId;
  },
  UPDATE_CONFIG(state, { id, data }) {
    const existingConfig = state.configs[id];
    if (existingConfig) {
      state.configs[id] = Object.assign(existingConfig, data);
    }
  },
};

const actions = {
  addConfig({ commit }, config) {
    commit('ADD_CONFIG', config);
  },
  updateConfig({ commit }, payload) {
    commit('UPDATE_CONFIG', payload);
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
