import { users } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import DashFooter from "~/components/dashboard/DashFooter";
import Spacer from "~/components/Spacer";
import { dashboardregistrymenu } from "~/utils/allmenus";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
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

// LOADER
export default function Registry() {
  const loaderdata=useLoaderData<LoaderData>();
  const currentuser=loaderdata.data.currentuser;
  
  return (
    <main className="px-2 lg:px-0">
      <section className="lg:hidden">
          <Spacer gapsize="1"/>
          <div className=""><CategoryMenu for="Registry" heading="Registry Options" /></div>
          <Spacer gapsize="1"/>
          <div className="py-4 bg-white shadow-lg rounded-lg">
            <div className=""><Outlet/></div>
          </div>
          <div className="lg:hidden"><DashFooter type="main" routename="registry"/></div>
      </section>

      <section className="hidden lg:block">
        <div className="w-11/12 mx-auto"><DashboardLayout ceremony={currentuser.ceremony?currentuser.ceremony:""} leftmenuarray={dashboardregistrymenu} maincontent={<Outlet/>} title={""} menuheading={"Registry"}/></div>
      </section>
    </main>
  )
}
