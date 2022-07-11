import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import { checkIfLoggedIn } from "~/utils/auth.server";
import { storage } from "~/utils/session";
// SERVER
export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));

    return json({
        data: {
            loggedin: await checkIfLoggedIn(session)
        }
    })
}

type LoaderData={
    data: {
        loggedin: boolean
    }
}

// CLIENT
export default function VendorsLayout() {
    const loaderdata=useLoaderData<LoaderData>();

  return (
    <main className="w-11/12 mx-auto">
        <Nav loggedin={loaderdata.data.loggedin}/>
        <Outlet/>
    </main>
  )
}
