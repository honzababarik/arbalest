import Vue from 'vue';
import Report from '../models/Report';

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
      };
    }

    job.is_running = true;
    job.started_at = Date.now();
    job.report = null;
    job.logs = [];
    job.responses = [];
    Vue.set(state.jobs, configId, job);
  },
  STOP_JOB(state, configId) {
    const job = state.jobs[configId];
    if (job) {
      job.ended_at = Date.now();
      job.is_running = false;
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
  ADD_REPORT(state, { configId, report }) {
    const job = state.jobs[configId];
    if (job) {
      job.report = report;
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
  addReport({ commit }, { configId, data }) {
    const jobReport = new Report(data);
    commit('ADD_REPORT', { configId, report: jobReport.toJSON() });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
