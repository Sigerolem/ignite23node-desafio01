import http from 'node:http'
import { routes } from './routes.js'
import { jsonfy } from './middlewares/jsonfy.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    await jsonfy(req, res)

    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()

})

server.listen(3333)