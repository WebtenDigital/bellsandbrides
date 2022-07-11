import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import { checkIfLoggedIn } from "~/utils/auth.server";
import { storage } from "~/utils/session";

export const loader:LoaderFunction=async function({request}){
  const session=await storage.getSession(request.headers.get("Cookie"));

  return json({
    data:{
      loggedin: await checkIfLoggedIn(session)
    }
  })
}

type LoaderData={
  data: {
    loggedin: boolean
  }
}

export default function Index(){
  const loaderdata:LoaderData=useLoaderData();
  const loggedin=loaderdata.data.loggedin

  return(
    <main>
      <div>
        <div className="w-11/12 mx-auto">
          {
            <Nav loggedin={loggedin}/>
          }  
        </div> 
      </div> 
    </main>
  )
}