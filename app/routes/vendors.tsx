import { Outlet } from "@remix-run/react";
import Nav from "~/components/Nav";

export default function VendorsLayout() {
  return (
    <main>
        <div className="w-11/12 mx-auto py-1"><Nav loggedin={true}/></div>
        <Outlet/>
    </main>
  )
}
