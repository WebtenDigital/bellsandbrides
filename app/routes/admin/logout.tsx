import { LoaderFunction, redirect } from "@remix-run/node"
import { adminsessionstorage } from "~/utils/session";

export const loader:LoaderFunction=async({request})=>{
    const session=await adminsessionstorage.getSession(request.headers.get("Cookie"));

    return redirect("/admin/login", {
        headers: {
            "Set-Cookie": await adminsessionstorage.destroySession(session)
        }
    });
}

export default function AdminLogout() {
  return (
    <div>logout</div>
  )
}