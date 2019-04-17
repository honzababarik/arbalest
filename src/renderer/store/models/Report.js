class Report {

  static visible = ['codes', 'stats', 'errors', 'latency', 'rps', 'created_at']

  codes = {}
  stats = {}
  errors = {}
  latency = {}
  rps = {}

  constructor(data = null) {
    if (data) {
      this.create(data);
    }
  }

  create(data) {
    const summary = data.aggregate;
    if (!summary) {
      console.error('Err creating report, aggregate is missing.');
      return;
    }

    this.codes = summary.codes;
    this.stats = summary.customStats;
    this.errors = summary.errors;
    this.latency = {
      min: Math.floor(summary.latency.min),
      med: Math.floor(summary.latency.median),
      max: Math.floor(summary.latency.max),
      p95: Math.floor(summary.latency.p95),
      p99: Math.floor(summary.latency.p99),
    };
    this.rps = {
      count: summary.rps.count,
      mean: summary.rps.mean,
    };
    this.created_at = summary.timestamp;
  }

  toJSON() {
    const model = {};
    Object.keys(Report.visible).forEach((i) => {
      const field = Report.visible[i];
      model[field] = this[field];
    });
    return model;
  }

}

export default Report;
