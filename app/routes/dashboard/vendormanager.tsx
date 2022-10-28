import { Outlet } from "@remix-run/react";
import DashFooter from "~/components/dashboard/DashFooter";
import Spacer from "~/components/Spacer";

export default function VendorsLayout() {
  return (
    <main>
      <div className="w-11/12 mx-auto lg:hidden">
        <Spacer gapsize="1"/>
        {/* <div className="min-h-screen py-4 bg-white shadow-lg rounded-lg"> */}
          <div className=""><Outlet/></div>
        {/* </div> */}
      <div className="lg:hidden"><DashFooter type="main" routename="vendors"/></div>
    </div>

      <div className="hidden lg:block">
        <div><Outlet/></div>
      </div>
    </main>


  )
}
