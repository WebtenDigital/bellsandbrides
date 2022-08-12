import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import { storage } from "~/utils/session";

// SERVER
export const loader:LoaderFunction=async({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  const userId=session.get('userId');

  const loggedin=userId?true:false;

  return json({
      data: {
          loggedin: loggedin
      }
  });
}

type LoaderData={
  data: {
      loggedin: boolean
  }
}

// CLIENT
export default function BlogLayout() {
  const loaderdata=useLoaderData<LoaderData>();

  return (
    <main className="w-11/12 mx-auto">
        <Nav loggedin={loaderdata.data.loggedin}/>
        <div id="spacer" className="py-1"></div>
        <Outlet/>
    </main>
  )
}
