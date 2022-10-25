import { Link, Outlet } from "@remix-run/react";
import CTA from "~/components/dashboard/CTA";
import Nav from "~/components/Nav";
import logo from '../images/logo-tp.png'

export default function BellsVendors() {
  return (
    <main>
      {/* <div className="w-11/12 mx-auto"><Nav loggedin={false}/></div> */}
        <div className="w-11/12 mx-auto py-2 flex justify-between items-center">
            <div className="w-3/12"><Link to="/"><img src={logo} alt="logo"/></Link></div>
            <div className="w-"><CTA type="fillednoarrow" url="/bellsvendor/logout" bgcolor="bg-purple-600" text="Logout"/></div>
        </div>
      <Outlet/>
    </main>
  )
}
