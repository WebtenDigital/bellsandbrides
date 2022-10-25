import { LoaderFunction, redirect } from "@remix-run/node";
import { vendorsessionstorage } from "~/utils/session";

export const loader:LoaderFunction=async({request})=>{
    const session=await vendorsessionstorage.getSession(request.headers.get("Cookie"));

    return redirect("/bellsvendor/myaccount", {
        headers: {
            "Set-Cookie": await vendorsessionstorage.destroySession(session)
        }
    });
}

export default function BellsVendorLogout() {
  return (
    <div>bells vendor logout</div>
  )
}
