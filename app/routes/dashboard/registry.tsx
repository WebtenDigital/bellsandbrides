import { Outlet } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import DashFooter from "~/components/dashboard/DashFooter";
import Spacer from "~/components/Spacer";

export default function Registry() {
  return (
    <main className="w-11/12 mx-auto">
      <Spacer gapsize="1"/>
      <div><CategoryMenu for="Account" heading="Account Options" /></div>
        <Spacer gapsize="1"/>
        <div className="py-4 bg-white shadow-lg rounded-lg">
          <div className="w-11/12 mx-auto"><Outlet/></div>
        </div>
      <DashFooter type="main" routename="registry"/>
    </main>
  )
}
