import { Outlet } from "react-router-dom"
import { NavBar } from "./common/NavBar"
import { Footer } from "./common/Footer"

export const Body = () => {
  return (
    <div>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}
