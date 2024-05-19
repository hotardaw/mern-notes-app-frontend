import { Outlet } from 'react-router-dom'

// This renders the children of the Outlet component
// We'll make this our parent component.
const Layout = () => {
  return <Outlet />
}

export default Layout
