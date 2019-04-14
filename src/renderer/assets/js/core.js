import Vue from 'vue';


const dvlt = {
  enums: {
  },
  router: {
  },
  time: {
  },
  notify(text, type = 'success', options = {}) {
    Vue.notify({
      text,
      type,
      ...options,
    });
  },
  utils: {
    isNil(val) {
      return val === null || val === undefined;
    },
    guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    },
  },
  string: {

  },
  validator: {
    isValidURLPath(val) {
      return val.length > 0 && val[0] === '/';
    },
    isValidBaseURL(val) {
      const re = /(ftp|http|https|ws):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
      const isValid = re.test(val);
      return isValid && val[val.length - 1] !== '/';
    },
  },
};

export default dvlt;
