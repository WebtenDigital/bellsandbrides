import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import { storage } from "~/utils/session";

export const loader:LoaderFunction=async function({request}){
  const session=await storage.getSession(request.headers.get("Cookie"));

  return json({
    sessionId: session.get("userId")
  })
}

type LoaderData={
  sessionId: string|undefined
}

export default function Index(){
  const loaderdata:LoaderData=useLoaderData();
  const loggedstate:boolean=loaderdata&&(loaderdata.sessionId?true:false);

  console.log(loggedstate);

  return(
    <main>
      <div>
        <div className="w-11/12 mx-auto">
          {
            <Nav loggedin={loggedstate}/>
          }  
        </div> 
      </div> 
    </main>
  )
}