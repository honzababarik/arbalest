import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Store from 'electron-store';
import modules from './modules';

const store = new Store();

const vuexStorage = createPersistedState({
  modules,
  paths: [
    'Test.tests',
    'Settings.settings',
    'Environment.environments',
    'Environment.currentEnvironmentId',
  ],
  storage: {
    getItem: (key) => {
      return store.get(key);
    },
    setItem: (key, value) => {
      return store.set(key, value);
    },
    removeItem: (key) => {
      return store.delete(key);
    },
  },
});

// store.clear()

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexStorage],
});
