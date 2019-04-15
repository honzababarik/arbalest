import dvlt from '../../assets/js/core';
import Config from '../models/Config';


// const updateConfig = (config, newConfig) => {
//   config.name = newConfig.name;
//   config.url = newConfig.url;
//   config.duration = newConfig.duration;
//   config.rate = newConfig.rate;
//   config.headers = newConfig.headers;
//   config.scenarios = newConfig.scenarios;
// };

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
    dvlt.array.moveElement(state.configs, oldIndex, newIndex);
  },
  IMPORT_CONFIGS(state, configs) {
    for (let i = 0; i < configs.length; i++) {
      const data = configs[i];
      if (!data.id) {
        continue;
      }

      let newConfig;
      try {
        newConfig = new Config(data);
      }
      catch (err) {
        console.log(`Error parsing file: ${err}`);
        continue;
      }

      const existingConfig = state.configs.find(c => c.id === data.id);
      if (existingConfig) {
        newConfig.mergeTo(existingConfig);
      }
      else {
        state.configs.push(newConfig.toJSON());
      }
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
  reorderConfig({ commit }, payload) {
    commit('REORDER_CONFIG', payload);
  },
  deleteConfig({ commit }, configId) {
    commit('DELETE_CONFIG', configId);
  },
  selectConfig({ commit }, configId) {
    commit('SELECT_CONFIG', configId);
  },
  importConfigs({ commit }, configs) {
    commit('IMPORT_CONFIGS', configs);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
