const toFlowJSON = (scenario) => {
  const data = {
    url: scenario.url,
    beforeRequest: 'beforeRequest',
    afterResponse: 'afterResponse',
  };
  if (scenario.headers) {
    data.headers = scenario.headers;
  }
  if (scenario.json) {
    data.json = scenario.json;
  }
  if (scenario.form) {
    data.form = scenario.form;
  }
  return {
    [scenario.method]: data,
  };
};

const toScenariosJSON = (scenarios) => {
  return [
    {
      flow: scenarios.map(scenario => toFlowJSON(scenario)),
    },
  ];
};


class ConfigBuilder {

  constructor(config, settings, environment) {
    this.targetUrl = config.url;
    this.duration = config.duration;
    this.rate = config.rate;
    this.timeout = settings.request.timeout || null;
    this.pool = settings.request.pool || null;
    this.headers = {};
    this.scenarios = [];
    this.variables = {};

    for (let i = 0; i < config.headers.length; i++) {
      const header = config.headers[i];
      this.addHeader(header.name, header.value);
    }

    for (let i = 0; i < config.scenarios.length; i++) {
      const scenario = config.scenarios[i];
      this.addScenario(scenario);
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

  addRequestScenario(scenario) {
    let form = null;
    let headers = null;
    if (scenario.form && scenario.form.length > 0) {
      form = {};
      scenario.form.forEach((value) => {
        form[value.name] = value.value;
      });
    }
    if (scenario.content_type) {
      headers = {
        'Content-Type': scenario.content_type,
      };
    }

    this.scenarios.push({
      method: scenario.method.toLowerCase(),
      headers,
      url: scenario.url,
      json: scenario.body || null,
      form,
    });
    return this;
  }

  addScenario(scenario) {
    if (scenario.type === 'request') {
      return this.addRequestScenario(scenario);
    }
    console.error(`Scenario type ${scenario.type} not supported`);
    return this;
  }

  toJSON() {
    const json = {
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
      scenarios: toScenariosJSON(this.scenarios),
    };
    if (this.timeout) {
      json.config.timeout = this.timeout;
    }
    if (this.pool) {
      json.config.pool = this.pool;
    }
    return json;
  }

}

export default ConfigBuilder;
