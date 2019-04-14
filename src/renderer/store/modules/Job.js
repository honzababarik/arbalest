import Vue from 'vue';

const state = {
  jobs: {},
};

const getters = {
  getJobs: state => state.jobs,
  getJobByConfigId: state => configId => state.jobs[configId],
};

const mutations = {
  START_JOB(state, configId) {
    let job = state.jobs[configId];
    if (!job) {
      job = {
        config_id: configId,
        logs: [],
        responses: [],
        report: null,
      };
    }

    job.is_running = true;
    job.report = {};
    Vue.set(state.jobs, configId, job);
  },
  STOP_JOB(state, configId) {
    const job = state.jobs[configId];
    if (job) {
      Vue.set(job, 'is_running', false);
    }
  },
  ADD_LOG(state, { configId, log }) {
    const job = state.jobs[configId];
    if (job) {
      job.logs.push(log);
    }
  },
  ADD_RESPONSE(state, { configId, response }) {
    const job = state.jobs[configId];
    if (job) {
      job.responses.push(response);
    }
  },
  CLEAR_JOB(state, configId) {
    const job = state.jobs[configId];
    if (job) {
      job.responses = [];
      job.logs = [];
      job.report = null;
    }
  },
};

const actions = {
  startJob({ commit }, configId) {
    commit('START_JOB', configId);
  },
  stopJob({ commit }, configId) {
    commit('STOP_JOB', configId);
  },
  addLog({ commit }, payload) {
    commit('ADD_LOG', payload);
  },
  addResponse({ commit }, payload) {
    commit('ADD_RESPONSE', payload);
  },
  clearJob({ commit }, configId) {
    commit('CLEAR_JOB', configId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
