import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import VendorSearch from "~/components/dashboard/VendorSearchByName";
import Nav from "~/components/Nav";
import Spacer from "~/components/Spacer";
import { getUser } from "~/utils/auth.server";
import { storage } from "~/utils/session";

// action
export const action:ActionFunction=async ({request})=>{
  const formdata=await request.formData();

  const searchedvalue=formdata.get('search')

  if(searchedvalue){
    return redirect(`/search/${searchedvalue}`);
  }
  else{
    return redirect(`/search/nothing`)
  }
}

// loader
export const loader:LoaderFunction=async({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));

  const user=await getUser(session);

  const loggedin=user?true:false
  return {
    data: {
      loggedin: loggedin
    }
  }
}

type LoaderData={
  data: {
    loggedin: boolean
  }
}

export default function Search() {
  const loaderdata=useLoaderData<LoaderData>();
  return (
    <main className="w-11/12 mx-auto">
        {/* Search */}
        <Nav loggedin={loaderdata.data.loggedin}/>
        <Spacer gapsize="2"/>
        <VendorSearch/>
        <Spacer gapsize="3"/>
        <Outlet/>
    </main>
  )
}
