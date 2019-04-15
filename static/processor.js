function beforeRequest(requestParams, context, ee, next) {
  context.vars.startedAt = Date.now();
  return next();
}

function afterResponse(requestParams, response, context, ee, next) {
  const contentType = response.headers['content-type'];
  const log = {
    type: 'response',
    data: {
      method: requestParams.method,
      url: requestParams.url,
      status: response.statusCode,
      time: Date.now() - context.vars.startedAt,
      content_type: contentType,
    },
  };
  if (contentType === 'application/json') {
    log.data.data = response.body;
  }
  console.log(JSON.stringify(log));
  return next();
}

module.exports = {
  afterResponse,
  beforeRequest,
};
