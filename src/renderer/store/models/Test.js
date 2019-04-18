class Test {

  static schema = {
    id: String,
    name: String,
    url: String,
    duration: Number,
    rate: Number,
    headers: Array,
    scenarios: Array,
  }
  static visible = ['id', 'name', 'url', 'duration', 'rate', 'headers', 'scenarios']
  static updateable = ['name', 'url', 'duration', 'rate', 'headers', 'scenarios']
  static all = ['id', 'name', 'url', 'duration', 'rate', 'headers', 'scenarios']

  constructor(data = null) {
    if (data) {
      this.create(data);
    }
  }

  // validate(data) {
  //   TODO validate against schema or throw error
  // }

  _updateFields(fields, data, model = this) {
    const updateFields = {};
    fields.forEach((field) => {
      if (data[field] !== undefined) {
        updateFields[field] = data[field];
      }
    });
    Object.assign(model, updateFields);
    return model;
  }

  create(data, model = this) {
    // this.validate(data);
    return this._updateFields(Test.all, data, model);
  }

  update(data, model = this) {
    return this._updateFields(Test.updateable, data, model);
  }

  mergeTo(model) {
    return this._updateFields(Test.updateable, this, model);
  }

  toJSON() {
    const model = {};
    Object.keys(Test.visible).forEach((i) => {
      const field = Test.visible[i];
      model[field] = this[field];
    });
    return model;
  }

}

export default Test;
