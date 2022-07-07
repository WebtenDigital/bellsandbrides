import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Nav from "~/components/Nav";
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
    return null;
  }
}

// CLIENT
export default function DashboardLayout() {
  return (
    <main className="bg-gray-50 min-h-screen">
        <div className="w-11/12 mx-auto"><Nav loggedin={true}/></div>
        {/* mobile footer */}
        <Outlet/>        
    </main>
  )
}
