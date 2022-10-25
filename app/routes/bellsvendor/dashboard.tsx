import { Outlet } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";

export default function VendorDashboardLayout() {
  return (
    <div>
        <div className="w-11/12 mx-auto"><CategoryMenu for="VendorDashboard" heading="Dashboard"/></div>
        <Outlet/>
    </div>

  )
}
