import Vue from 'vue';

const state = {
  settings: {
    general: {
      should_display_sys_info: false,
    },
    request: {
      does_verify_SSL: true,
      does_log_progress: false,
      timeout: null,
      pool: null,
    },
  },
};

const getters = {
  getSettings: state => state.settings,
  getSettingsValue: state => key => state.settings[key],
};

const mutations = {
  CHANGE_SETTINGS(state, { key, value }) {
    Vue.set(state.settings, key, value);
  },
  CHANGE_REQUEST_SETTINGS(state, { key, value }) {
    Vue.set(state.settings.request, key, value);
  },
  CHANGE_GENERAL_SETTINGS(state, { key, value }) {
    Vue.set(state.settings.general, key, value);
  },
};

const actions = {
  changeSettings({ commit }, payload) {
    commit('CHANGE_SETTINGS', payload);
  },
  changeRequestSettings({ commit }, payload) {
    commit('CHANGE_REQUEST_SETTINGS', payload);
  },
  changeGeneralSettings({ commit }, payload) {
    commit('CHANGE_GENERAL_SETTINGS', payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
