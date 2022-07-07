import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// SERVER
export const loader:LoaderFunction=async function(){
    // when someone comes to this route, they should be redirected to the information route
    return redirect('/dashboard/account/personal-info');
}
  
export default function AccountIndex() {
    const loaderdata=useLoaderData();
  return (
    <div>index</div>
  )
}
