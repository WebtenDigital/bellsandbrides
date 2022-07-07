import { Outlet } from "@remix-run/react";
import DashFooter from "~/components/dashboard/DashFooter";

export default function VendorsLayout() {
  return (
    <div className="mx-2">
        <Outlet/>
        <DashFooter type="main" routename="vendors"/>
    </div>
  )
}
