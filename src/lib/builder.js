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

  constructor(config, environment) {
    this.targetUrl = config.url;
    this.duration = config.duration;
    this.rate = config.rate;
    this.headers = {};
    this.scenarios = [];
    this.variables = {};

    for (let i = 0; i < config.headers.length; i++) {
      const header = config.headers[i];
      this.addHeader(header.name, header.value);
    }

    for (let i = 0; i < config.scenarios.length; i++) {
      const scenario = config.scenarios[i];
      this.addScenario(scenario.method.toLowerCase(), scenario.url);
    }

    if (environment && environment.variables) {
      for (let i = 0; i < environment.variables.length; i++) {
        const variable = environment.variables[i];
        this.addVariable(variable.key, variable.value);
      }
    }
  }

  addHeader(name, value) {
    this.headers[name] = value;
    return this;
  }

  addVariable(key, value) {
    this.targetUrl = this.targetUrl.replace(`{{${key}}}`, value);
    this.variables[key] = value;
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
        variables: this.variables,
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
