import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import Home from './components/Home'
import About from './components/About'
import OurWork from './components/OurWork'
import MeetTheTeam from './components/MeetTheTeam'
import Resources from './components/Resources'
import GetInvolved from './components/GetInvolved'
import Contact from './components/Contact'
import Donate from './components/Donate'
import NotFound from './components/NotFound'
import Reports from './components/Reports'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Admin from './components/Admin'
import Marketplace from './components/Marketplace'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'our-work', element: <OurWork /> },
        { path: 'team', element: <MeetTheTeam /> },
        { path: 'resources', element: <Resources /> },
        { path: 'get-involved', element: <GetInvolved /> },
        { path: 'contact', element: <Contact /> },
        { path: 'donate', element: <Donate /> },
        { path: 'reports', element: <Reports /> },
        { path: 'blog', element: <Blog /> },
        { path: 'blog/:slug', element: <BlogPost /> },
        { path: 'marketplace', element: <Marketplace /> },
      ]
    },
    { path: 'admin', element: <Admin /> },
    { path: '*', element: <NotFound /> }
  ])

  return <RouterProvider router={router} />
}

export default App