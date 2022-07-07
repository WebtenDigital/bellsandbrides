import { LoaderFunction, redirect } from "@remix-run/node"
import { endSession } from "~/utils/auth.server";
import { storage } from "~/utils/session";

// SERVER
export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));

    return endSession(session);
}

// CLIENT
export default function Logout() {
  return (
    <div>logout</div>
  )
}
