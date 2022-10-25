import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { adminsessionstorage } from "~/utils/session";

// Action
export const action:ActionFunction=async({request})=>{
    return null;
}

// Loader
export const loader:LoaderFunction=async({request})=>{
  const session=await adminsessionstorage.getSession(request.headers.get("Cookie"));
  if(session.get("admin_pwd")){
    return redirect("/admin/dashboard");
  }
  else return redirect("/admin/login");

}

// CLIENT
export default function AdminIndex() {
  return (
    <main>
        Admin
    </main>
  )
}
