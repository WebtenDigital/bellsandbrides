import Heading from "~/components/dashboard/Heading";
import bellstitleimg from '../images/bellsandbrides-line-tp.png'
import dashimages from "~/utils/dashimages";
import Spacer from "~/components/Spacer";
import Sentence from "~/components/dashboard/Sentence";
import Separator from "~/components/Separator";
import StepNextButton from "~/components/StepNextButton";
import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { storage } from "~/utils/session";
import { db } from "~/utils/db.server";

// SERVER
// Loader
export const loader:LoaderFunction=async ({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  const sessionId=parseInt(session.get('userId'));

  // first things first, add registry name to the database
  const user=await db.users.findUnique({
    where: {
      id: sessionId
    }
  });

  // get the user's first name and their spouse's first name, join them to create a title for the registry, and add it to database
  const userfirstname=user?.firstname;
  const partnerfirstname=user?.partnerfirstname;
  const registry_name=`${userfirstname} & ${partnerfirstname}'s Registry`

  const addRegistryName=await db.users.update({
    where: {
      id: sessionId
    },
    data: {
      registry_name: registry_name
    }
  });

  // now retrieve the newly created registry name from the database
  const registrytitle=registry_name;

  if(!sessionId){
      return redirect('/myaccount');
  }
  else return json({
    data: {
      registrytitle: registrytitle
    }
  });
}

type LoaderData={
  data: {
    registrytitle: string
  }
}


// CLIENT
export default function WelcomeToRegistry() {
  const loaderdata=useLoaderData<LoaderData>();
  const registrytitle=loaderdata.data.registrytitle;

  return (
    <main>
        <div id="image" className="relative -z-10">
          <img src={dashimages.pillows} alt="welcome-image" className="w-full h-56 object-cover"/>
        </div>
        <div id="content" className="-mt-10 rounded-t-4xl bg-white">
          <div className="w-10/12 mx-auto">
            <div className="py-4 w-11/12 mx-auto"><img src={bellstitleimg} alt="bells and brides alternative logo"/></div>
            <Heading type="main" text={registrytitle}/>
            <Spacer gapsize="2"/>
            <Sentence text="Welcome to your Bells and Brides registry."/>
            <Spacer gapsize="2"/>
            <Sentence text={`Deciding on which gift to give a couple is not and easy task. This is where the registry comes in.`}/>
            <Spacer gapsize="2"/>
            <Sentence text="To make it easier for your guests, let them know what you and your spouse would like to have, so you don’t end up with things you wouldn’t want or already have."/>
            <Spacer gapsize="2"/>
            <Sentence text="Start by adding some gifts from our store to your registry."/>
            <div className="py-8"><Separator bordercolor="gray-300"/></div>
            <Link to="/shop" className="flex justify-end gap-4 items-center">
              <Heading type="sub" text="start adding gifts"/>
              <div className="p-3 bg-gray-900 rounded-full "> 
                  <StepNextButton arrowcolor="text-white"/>
              </div>
            </Link>
          </div>
        </div>
    </main>
  )
}
