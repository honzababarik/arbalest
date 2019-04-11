const toScenarioJSON = (scenario) => {
  return {
    flow: [{
      [scenario.method]: {
        url: scenario.url,
        beforeRequest: 'beforeRequest',
        afterResponse: 'afterResponse',
      },
    }],
  };
};


class ConfigBuilder {

  constructor(targetUrl, duration, rate) {
    this.targetUrl = targetUrl;
    this.duration = duration;
    this.rate = rate;
    this.headers = {};
    this.scenarios = [];
  }

  addHeader(name, value) {
    this.headers[name] = value;
    return this;
  }

  addScenario(method, url) {
    this.scenarios.push({ method, url });
    return this;
  }

  toJSON() {
    return {
      config: {
        target: this.targetUrl,
        phases: [{
          duration: this.duration,
          arrivalRate: this.rate,
        }],
        processor: '../static/processor.js',
        defaults: {
          headers: this.headers,
        },
      },
      scenarios: this.scenarios.map(scenario => toScenarioJSON(scenario)),
    };
  }

}

export default ConfigBuilder;
