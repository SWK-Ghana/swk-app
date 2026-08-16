import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'

// Build-time prerender entry (see scripts/prerender.mjs). Renders any route —
// including its route.lazy module and loader data — to an HTML string, so
// crawlers receive full page content instead of an empty SPA shell.
const handler = createStaticHandler(routes)

export async function render(path) {
  const context = await handler.query(new Request(`https://swkghana.org${path}`))
  if (context instanceof Response) {
    return { redirect: context.headers.get('Location') || '/' }
  }
  const router = createStaticRouter(handler.dataRoutes, context)
  const html = renderToString(<StaticRouterProvider router={router} context={context} />)
  return { html }
}
