function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function getContentType(headers) {
  let contentType = headers['content-type'];
  if (contentType) {
    contentType = contentType.split(';')[0];
  }
  return contentType;
}

function beforeRequest(requestParams, context, ee, next) {
  context.vars.startedAt = Date.now();
  return next();
}

function afterResponse(requestParams, response, context, ee, next) {
  const startedAt = context.vars.startedAt;
  const endedAt = Date.now();
  const contentType = getContentType(response.headers);
  const log = {
    type: 'response',
    data: {
      method: requestParams.method,
      url: requestParams.url,
      path: response.request.path,
      status_code: response.statusCode,
      started_at: startedAt,
      ended_at: endedAt,
      time: endedAt - startedAt,
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
