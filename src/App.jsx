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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {index: true, element: <Home />},
        {path: "about", element: <About />},
        {path: "our-work", element: <OurWork />},
        {path: "team", element: <MeetTheTeam />},
        {path: "resources", element: <Resources />},
        {path: "get-involved", element: <GetInvolved />},
        {path: "contact", element: <Contact />}
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
