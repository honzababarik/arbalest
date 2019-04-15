import Vue from 'vue';


const dvlt = {
  enums: {
  },
  router: {
  },
  time: {
  },
  consts: {
    KEY_TAB: 9,
    KEY_ENTER: 13,
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
  array: {
    moveElement(arr, oldIndex, newIndex) {
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },
  },
  string: {
    replaceAll(str, search, replacement) {
      return str.replace(new RegExp(search, 'g'), replacement);
    },
  },
  validator: {
    isValidURLPath(val) {
      return val.length > 0 && val[0] === '/';
    },
    isValidBaseURL(val) {
      const re = /(ftp|http|https|ws):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
      return re.test(val);
    },
  },
  style: {
    getMethodStyle(method) {
      switch (method) {
        case 'GET':
          return 'success';
        case 'POST':
          return 'warning';
        case 'PATCH':
        case 'PUT':
          return 'info';
        case 'DELETE':
          return 'danger';
        default: return '';
      }
    },
  },
  data: {
    httpMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    contentTypes: [
      'application/json',
      'x-www-form-urlencoded',
    ],
  },
};

export default dvlt;
