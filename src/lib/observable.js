class Observable {

  constructor() {
    this.listeners = {};
  }

  removeAllListeners() {
    this.listeners = {};
  }

  getListenerIndex(eventName, fn) {
    if (!this.listeners[eventName]) {
      return -1;
    }
    for (let i = 0; i < this.listeners[eventName].length; i++) {
      if (this.listeners[eventName][i] === fn) {
        return i;
      }
    }
    return -1;
  }

  removeListener(eventName, fn) {
    const index = this.getListenerIndex(eventName, fn);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  on(eventName, fn) {
    const index = this.getListenerIndex(eventName, fn);
    if (index === -1) {
      this.addEventListener(eventName, fn);
    }
    return this;
  }

  addEventListener(eventName, fn) {
    if (!fn) {
      return console.error(`Cannot add listener to ${eventName}, function is nil.`);
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(fn);
    return this;
  }

  emit(eventName, data) {
    if (this.listeners[eventName]) {
      for (let i = 0; i < this.listeners[eventName].length; i++) {
        this.listeners[eventName][i](data);
      }
    }
  }

}

export default Observable;
