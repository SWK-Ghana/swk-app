import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About'
import OurWork from './components/OurWork'
import Contact from './components/Contact'
import GetInvolved from './components/GetInvolved'
import Donate from './components/Donate'
import Reports from './components/Reports'
import Resources from './components/Resources'
import MeetTheTeam from './components/MeetTheTeam'
import NotFound from './components/NotFound'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Admin from './components/Admin'

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
)

const router = createBrowserRouter([
  { path: '/', element: <Layout><Home /></Layout> },
  { path: 'about', element: <Layout><About /></Layout> },
  { path: 'our-work', element: <Layout><OurWork /></Layout> },
  { path: 'contact', element: <Layout><Contact /></Layout> },
  { path: 'get-involved', element: <Layout><GetInvolved /></Layout> },
  { path: 'donate', element: <Layout><Donate /></Layout> },
  { path: 'reports', element: <Layout><Reports /></Layout> },
  { path: 'resources', element: <Layout><Resources /></Layout> },
  { path: 'meet-the-team', element: <Layout><MeetTheTeam /></Layout> },
  { path: 'blog', element: <Layout><Blog /></Layout> },
  { path: 'blog/:slug', element: <Layout><BlogPost /></Layout> },
  { path: 'admin', element: <Admin /> },
  { path: '*', element: <Layout><NotFound /></Layout> },
])

export default function App() {
  return <RouterProvider router={router} />
}