import { Outlet } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import DashFooter from "~/components/dashboard/DashFooter";
import Spacer from "~/components/Spacer";

export default function Registry() {
  return (
    <main className="px-2">
        <Spacer gapsize="1"/>
        <div className=""><CategoryMenu for="Registry" heading="Registry Options" /></div>
        <Spacer gapsize="1"/>
        <div className="py-4 bg-white shadow-lg rounded-lg">
          <div className=""><Outlet/></div>
        </div>
      <DashFooter type="main" routename="registry"/>
    </main>
  )
}
