import Vue from 'vue';
import Report from '../models/Report';

const state = {
  jobs: {},
};

const getters = {
  getJobs: state => state.jobs,
  getJobByTestId: state => testId => state.jobs[testId],
};

const mutations = {
  START_JOB(state, test) {
    const testId = test.id;
    let job = state.jobs[testId];
    if (!job) {
      job = {
        test_id: testId,
      };
    }

    job.is_running = true;
    job.started_at = Date.now();
    job.report = null;
    job.logs = [];
    job.responses = [];
    job.duration = test.duration;
    job.rate = test.rate;
    job.scenarioCount = test.scenarios.length;
    Vue.set(state.jobs, testId, job);
  },
  STOP_JOB(state, testId) {
    const job = state.jobs[testId];
    if (job) {
      job.ended_at = Date.now();
      job.is_running = false;
    }
  },
  ADD_LOG(state, { testId, log }) {
    const job = state.jobs[testId];
    if (job) {
      job.logs.push(log);
    }
  },
  ADD_RESPONSE(state, { testId, response }) {
    const job = state.jobs[testId];
    if (job) {
      job.responses.push(response);
    }
  },
  ADD_REPORT(state, { testId, report }) {
    const job = state.jobs[testId];
    if (job) {
      job.report = report;
    }
  },
  CLEAR_JOB(state, testId) {
    const job = state.jobs[testId];
    if (job) {
      job.responses = [];
      job.logs = [];
      job.report = null;
    }
  },
};

const actions = {
  startJob({ commit }, test) {
    commit('START_JOB', test);
  },
  stopJob({ commit }, testId) {
    commit('STOP_JOB', testId);
  },
  addLog({ commit }, payload) {
    commit('ADD_LOG', payload);
  },
  addResponse({ commit }, payload) {
    commit('ADD_RESPONSE', payload);
  },
  clearJob({ commit }, testId) {
    commit('CLEAR_JOB', testId);
  },
  addReport({ commit }, { testId, data }) {
    const jobReport = new Report(data);
    commit('ADD_REPORT', { testId, report: jobReport.toJSON() });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
