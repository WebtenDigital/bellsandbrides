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
    <main className="bg-gray-50 min-h-screen lg:relative">
        <div className="lg:sticky lg:top-0 lg:bg-gray-50 lg:z-30">
          <div className="w-11/12 mx-auto"><Nav loggedin={true}/></div>
        </div>
        {/* mobile footer */}
        <div className="lg:px-4 lg:flex lg:gap-x-6">
          <div className="relative hidden lg:block w-3/12">
            <div className="fixed w-3/12 min-h-screen lg:bg-white shadow-xl lg:rounded-2xl">
              comment ca va
            </div>
          </div>

          <div className="lg:w-9/12 lg:bg-white lg:rounded-2xl">
            <div className="lg:w-11/12 lg:mx-auto"><Outlet/></div>
          </div>  
        </div>
    </main>
  )
}
