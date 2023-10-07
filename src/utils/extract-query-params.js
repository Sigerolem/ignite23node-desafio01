export function extractQueryParams(query) {
  const queryParams = query.substring(1).split('&').reduce((qParams, param) => {
    const [key, value] = param.split('=')
    qParams[key] = value

    return qParams
  }, {})

  return queryParams
}