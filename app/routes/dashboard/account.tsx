import { users } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import DashFooter from "~/components/dashboard/DashFooter";
import Spacer from "~/components/Spacer";
import { dashboardaccountmenu } from "~/utils/allmenus";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// Loader
export const loader:LoaderFunction=async ({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  const sessionId=parseInt(session.get('userId'));

  // query database for the already existing values -- we shall place these in the form's value field, and only replaced when a new value is added
  const user=await db.users.findUnique({
    where: {
      id: sessionId
    }
  });

  return json({
    data: {
      currentuser: user
    }
  })
}

type LoaderData={
  data: {
    currentuser: users
  }
}

// CLIENT
export default function ManageAccount() {
  const loaderdata=useLoaderData<LoaderData>();
  const currentuser=loaderdata.data.currentuser;

  return (
    <main className="mx-2">
        <div className="lg:hidden">
          <Spacer gapsize="1"/>
          <div><CategoryMenu for="Account" heading="Account Options" /></div>
          <Spacer gapsize="1"/>
          <div className="py-4 bg-white shadow-lg rounded-lg">
            <div className="w-11/12 mx-auto"><Outlet/></div>
          </div>
          <div className="lg:hidden"><DashFooter type="main" routename="account"/></div>
        </div>

        <div className="hidden lg:block">
          <div className="w-11/12 mx-auto"><DashboardLayout ceremony={currentuser.ceremony?currentuser.ceremony:"Wedding"} leftmenuarray={dashboardaccountmenu} maincontent={<Outlet/>} menuheading={"Settings"}/></div>
        </div>
    </main>
  )
}