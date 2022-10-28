import { users } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Heading from "~/components/dashboard/Heading";
import Nav from "~/components/Nav";
import { mainDashMenu } from "~/utils/allmenus";
import { getUser } from "~/utils/auth.server";
import { storage } from "~/utils/session";

// SERVER
export const loader:LoaderFunction=async ({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));

  const user=await getUser(session);

  if(!user){
    return redirect('/myaccount');
  }
  else {
    return json({
      data: {
        user: user
      }
    });
  }
}

type LoaderData={
  data: {
    user: users
  }
}

// CLIENT
export default function DashboardLayout() {
  const loaderdata=useLoaderData<LoaderData>();
  const user=loaderdata.data.user;

  return (
    <main className="bg-gray-50 min-h-screen lg:relative">
        <div className="lg:sticky lg:top-0 lg:bg-gray-50 lg:z-30">
          <div className="w-11/12 mx-auto"><Nav loggedin={true}/></div>
        </div>

        <div className=""><Outlet/></div>
    </main>
  )
}
