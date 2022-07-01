import { Outlet } from "@remix-run/react";
import Nav from "~/components/Nav";

export default function BlogLayout() {
  return (
    <main className="w-11/12 mx-auto">
        <Nav loggedin={false}/>
        <div id="spacer" className="py-1"></div>
        <Outlet/>
    </main>
  )
}
