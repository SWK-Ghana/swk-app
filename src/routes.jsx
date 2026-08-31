import React from 'react'
import RootLayout from './components/layout/RootLayout'
import Home from './components/Home'
import PageFallback from './components/PageFallback'

// Shared route table used by BOTH the browser app (createBrowserRouter in
// App.jsx) and the build-time prerenderer (createStaticHandler in
// entry-server.jsx). Routes use `lazy` (resolved by the router itself before
// rendering) instead of React.lazy — this keeps code-splitting in the browser
// while letting the prerenderer emit full page content instead of Suspense
// spinners. Home stays eager: it is the LCP-critical landing page.

// Adapt a default-export component module to a route module.
const page = (importer) => async () => {
  const m = await importer()
  return { Component: m.default, ...(m.loader ? { loader: m.loader } : {}) }
}

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    HydrateFallback: PageFallback,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', lazy: page(() => import('./components/About')) },
      { path: 'our-work', lazy: page(() => import('./components/OurWork')) },
      { path: 'team', lazy: page(() => import('./components/MeetTheTeam')) },
      { path: 'resources', lazy: page(() => import('./components/Resources')) },
      { path: 'faq', lazy: page(() => import('./components/FAQ')) },
      { path: 'get-involved', lazy: page(() => import('./components/GetInvolved')) },
      { path: 'contact', lazy: page(() => import('./components/Contact')) },
      { path: 'donate', lazy: page(() => import('./components/Donate')) },
      { path: 'reports', lazy: page(() => import('./components/Reports')) },
      { path: 'blog', lazy: page(() => import('./components/Blog')) },
      { path: 'blog/:slug', lazy: page(() => import('./components/BlogPost')) },
      { path: 'marketplace', lazy: page(() => import('./components/Marketplace')) },
      { path: 'taka-kipawa', lazy: page(() => import('./components/TakaKipawa')) },
      { path: 'privacy-policy', lazy: page(() => import('./components/PrivacyPolicy')) },
    ],
  },
  { path: 'admin', lazy: page(() => import('./components/Admin')) },
  { path: '*', lazy: page(() => import('./components/NotFound')) },
]
