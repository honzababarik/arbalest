function beforeRequest(requestParams, context, ee, next) {
  context.vars['startedAt'] = Date.now()
  return next();
}

function afterResponse(requestParams, response, context, ee, next) {
  console.log(JSON.stringify({
    type: 'response',
    data: {
      method: requestParams.method,
      url: requestParams.url,
      status: response.statusCode,
      data: response.body,
      time: Date.now() - context.vars['startedAt']
    },
  }));
  return next();
}

module.exports = {
  afterResponse,
  beforeRequest,
};
