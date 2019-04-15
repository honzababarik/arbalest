import Vue from 'vue';
import dvlt from '@/assets/js/core';

const state = {
  environments: {},
  currentEnvironmentId: null,
};

const getters = {
  getEnvironments: state => state.environments,
  getEnvironmentById: state => id => state.environments[id],
  getCurrentEnvironment: state => state.environments[state.currentEnvironmentId],
};

const mutations = {
  SELECT_ENVIRONMENT(state, id) {
    state.currentEnvironmentId = id;
  },
  ADD_ENVIRONMENT(state, {
    id, name, color, variables,
  }) {
    Vue.set(state.environments, id, {
      id,
      name,
      color,
      variables,
    });
  },
  EDIT_ENVIRONMENT(state, {
    id, name, color, variables,
  }) {
    const environment = state.environments[id];
    if (environment) {
      environment.name = name;
      environment.color = color;
      environment.variables = variables;
    }
  },
  DELETE_ENVIRONMENT(state, id) {
    Vue.delete(state.environments, id);
  },
};

const actions = {
  addEnvironment({ commit }, payload) {
    payload.id = dvlt.utils.guid();
    commit('ADD_ENVIRONMENT', payload);
  },
  editEnvironment({ commit }, payload) {
    commit('EDIT_ENVIRONMENT', payload);
  },
  selectEnvironment({ commit }, id) {
    commit('SELECT_ENVIRONMENT', id);
  },
  deleteEnvironment({ commit }, id) {
    commit('DELETE_ENVIRONMENT', id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
