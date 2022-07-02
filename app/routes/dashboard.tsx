import { Outlet } from "@remix-run/react";
import Nav from "~/components/Nav";

export default function DashboardLayout() {
  return (
    <main className="bg-gray-50">
        <div className="w-11/12 mx-auto"><Nav loggedin={true}/></div>
        {/* mobile footer */}
        <Outlet/>        
    </main>
  )
}
