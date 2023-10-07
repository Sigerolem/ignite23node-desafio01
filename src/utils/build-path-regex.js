export function buildPathRegex(path) {
  const paramsWithParams = path.replace(/:([a-zA-Z]+)/g, '(?<$1>[a-z0-9\-_]+)')
  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}