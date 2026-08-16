import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'

// Route definitions live in src/routes.jsx, shared with the build-time
// prerenderer (src/entry-server.jsx) that emits static HTML for SEO.
function App() {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default App
