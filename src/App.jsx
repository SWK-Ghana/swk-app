import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import Home from './components/Home'

// Home is eager (it's the most common landing page / LCP). Everything else is
// code-split so the initial bundle stays small — heavy routes like Admin,
// Marketplace and Blog (which pull in the Sanity client) load only on demand.
const About = lazy(() => import('./components/About'))
const OurWork = lazy(() => import('./components/OurWork'))
const MeetTheTeam = lazy(() => import('./components/MeetTheTeam'))
const Resources = lazy(() => import('./components/Resources'))
const FAQ = lazy(() => import('./components/FAQ'))
const GetInvolved = lazy(() => import('./components/GetInvolved'))
const Contact = lazy(() => import('./components/Contact'))
const Donate = lazy(() => import('./components/Donate'))
const NotFound = lazy(() => import('./components/NotFound'))
const Reports = lazy(() => import('./components/Reports'))
const Blog = lazy(() => import('./components/Blog'))
const BlogPost = lazy(() => import('./components/BlogPost'))
const Admin = lazy(() => import('./components/Admin'))
const Marketplace = lazy(() => import('./components/Marketplace'))
const VendorPage = lazy(() => import('./components/VendorPage'))
const TakaKipawa = lazy(() => import('./components/TakaKipawa'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin"
      style={{ borderColor: '#78C31E', borderTopColor: 'transparent' }}
      role="status" aria-label="Loading" />
  </div>
)

// Wrap a lazily-loaded element in Suspense so it shows a fallback while fetching.
const withSuspense = (el) => <Suspense fallback={<PageFallback />}>{el}</Suspense>

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: withSuspense(<About />) },
        { path: 'our-work', element: withSuspense(<OurWork />) },
        { path: 'team', element: withSuspense(<MeetTheTeam />) },
        { path: 'resources', element: withSuspense(<Resources />) },
        { path: 'faq', element: withSuspense(<FAQ />) },
        { path: 'get-involved', element: withSuspense(<GetInvolved />) },
        { path: 'contact', element: withSuspense(<Contact />) },
        { path: 'donate', element: withSuspense(<Donate />) },
        { path: 'reports', element: withSuspense(<Reports />) },
        { path: 'blog', element: withSuspense(<Blog />) },
        { path: 'blog/:slug', element: withSuspense(<BlogPost />) },
        { path: 'marketplace', element: withSuspense(<Marketplace />) },
        { path: 'marketplace/vendor/:slug', element: withSuspense(<VendorPage />) },
        { path: 'taka-kipawa', element: withSuspense(<TakaKipawa />) },
        { path: 'privacy-policy', element: withSuspense(<PrivacyPolicy />) },
      ]
    },
    { path: 'admin', element: withSuspense(<Admin />) },
    { path: '*', element: withSuspense(<NotFound />) }
  ])

  return <RouterProvider router={router} />
}

export default App
