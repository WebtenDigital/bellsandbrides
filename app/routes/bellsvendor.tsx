import { Outlet } from "@remix-run/react";
import Nav from "~/components/Nav";

export default function BellsVendors() {
  return (
    <main>
      <div className="w-11/12 mx-auto"><Nav loggedin={false}/></div>
      <Outlet/>
    </main>
  )
}
