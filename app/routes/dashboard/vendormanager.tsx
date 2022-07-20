import { Outlet } from "@remix-run/react";
import DashFooter from "~/components/dashboard/DashFooter";
import Spacer from "~/components/Spacer";

export default function VendorsLayout() {
  return (
    <main className="w-11/12 mx-auto">
        <Spacer gapsize="1"/>
        {/* <div className="min-h-screen py-4 bg-white shadow-lg rounded-lg"> */}
          <div className=""><Outlet/></div>
        {/* </div> */}
      <DashFooter type="main" routename="vendors"/>
    </main>
  )
}
