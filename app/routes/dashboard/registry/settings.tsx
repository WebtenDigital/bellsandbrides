import { users } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import Spacer from "~/components/Spacer";
import SuperSpinner from "~/components/SuperSpinner";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  const sessionId=parseInt(await session.get('userId'));

  // get form data
  const formdata=await request.formData();
  const registrywelcomemessage=formdata?.get('welcome_message')?.toString();
  const streetaddress=formdata.get('street_address')?.toString();
  const apartmentbuilding=formdata.get('apartment_building')?.toString();
  const floornumber=formdata.get('floor_number')?.toString();
  const phonenumber=formdata.get('phone_number')?.toString();
  const additionalinfo=formdata.get('additional_location_info')?.toString();

  // get user
  const user=await db.users.findUnique({
    where: {
      id: sessionId
    }
  });

  // add shipping details to the user's table in database on saving changes
    const updateshippingdetails=await db.users.update({
      where: {
        id: sessionId
      },
      data: {
        // update if there is new info, otherwise, use what already exists in their place in the database
        registry_welcome_message: registrywelcomemessage?registrywelcomemessage:user?.registry_welcome_message,
        shipping_street_address: streetaddress?streetaddress:user?.shipping_street_address,
        shipping_apt_building: apartmentbuilding?apartmentbuilding:user?.shipping_apt_building,
        shipping_floor_number: floornumber?floornumber:user?.shipping_floor_number,
        shipping_phone_number: phonenumber?phonenumber:user?.shipping_phone_number,
        shipping_additional_location_info: additionalinfo?additionalinfo:user?.shipping_additional_location_info
      }
    });


  return json({
    data: {

    }
  });
}

// Loader
export const loader:LoaderFunction=async({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  const sessionId=await session.get('userId');

  const user=await db.users.findUnique({
    where: {
      id: parseInt(sessionId)
    }
  });

  const userfirstname=user?.firstname?.toLowerCase();
  const partnerfirstname=user?.partnerfirstname?.toLowerCase();
  const userid=user?.id;

  // const userregistrylink=`http://bellsandbrides.com/coupleregistry?ufn=${userfirstname}&pfn=${partnerfirstname}&uid=${userid}`
  const userregistrylink=`http://localhost:3000/coupleregistry?${userfirstname}-and-${partnerfirstname}-s-registry&uid=${userid}`

  return json({
    data: {
      userreglink:userregistrylink,
      user: user
    }
  });
}

type ActionData={
  data: {

  }
}

type LoaderData={
  data: {
    userreglink: string
    user: users
  }
}

// CLIENT
export default function RegistrySettings() {
  const loaderdata=useLoaderData<LoaderData>();
  const [copied, setCopied]=useState(false);

  const user=loaderdata.data.user;

  const transition=useTransition();

  // clipboard
async function copyTextToClipboard(text:string){
  if('clipboard' in navigator){
    setCopied(true);

    return await navigator.clipboard.writeText(text);
  }
  else return null;
}

function settingsInput(name:string, placeholder?:string, type?: string, minLength?:number, pattern?:string){
  return <input type={type?type:"text"} name={name} className="w-full py-2 pl-2 text-sm text-gray-700 border border-gray-300 rounded-xl focus:outline-none placeholder:text-sm focus:invalid:bg-red-100 focus:invalid:border-peach" placeholder={placeholder} minLength={minLength}/>

}

  return (
    <main className="w-11/12 mx-auto pb-20">
        <Heading type="main" text="Registry Settings"/>
        <Spacer gapsize="2"/>
    
        <Form method="post">
          {/* welcome message */}
          <Heading type="sub" text="Registry welcome message"/>
          <div className="py-2"><Sentence text="A custom welcome message for your guests when they visit your registry."/></div>
          <textarea className="w-full py-2 px-2 text-sm border border-gray-200 rounded-xl placeholder:text-sm placeholder:text-gray-300 focus:outline-none" name="welcome_message" rows={5} placeholder={user.registry_welcome_message?.length?user.registry_welcome_message:"Type welcome message here..."}/>
          <Spacer gapsize="4"/>
          
          {/* registry link */}
          <div id="registry-link">
            <Heading type="sub" text="Your registry link"/>
            <div className="py-2"><Sentence text="This is the link that you will share with your guests to visit and see your registry."/></div>
            <div>
              <p className="px-2 py-2 text-xs text-gray-300 border border-gray-300 rounded-xl">{loaderdata.data.userreglink}</p>
              <Spacer gapsize="1"/>
              <div className="flex justify-end"><button type="button" onClick={async()=>{await copyTextToClipboard(loaderdata.data.userreglink)}} className="px-2 py-1 text-sm text-peach font-semibold border border-red-400 rounded-xl">{copied?`Copied!`:`Copy Link`}</button></div>
            </div>
          </div>

          <Spacer gapsize="4"/>

          {/* Shipping Info */}
          <div id="shipping-address">
            <Heading type="sub" text="Registry shipping details"/>
            <Spacer gapsize="1"/>
            <Sentence text="Please provide the address where you'd like your gifts to be shipped."/>
            <Spacer gapsize="3"/>
            <Sentence text="Street Address"/>
            <Spacer gapsize="1"/>
            {settingsInput('street_address', user.shipping_street_address?user.shipping_street_address:"")}
            <Spacer gapsize="2"/>

            {/* apt / building */}
            <div className="py-4 flex items-center gap-2">
              <div>
                <Sentence text="Apartment / Building"/>
                <Spacer gapsize="1"/>
                {settingsInput('apartment_building', user.shipping_apt_building?user.shipping_apt_building:"")}
              </div>
              <div>
                <Sentence text="Floor / Number"/>
                <Spacer gapsize="1"/>
                {settingsInput('floor_number', user.shipping_floor_number?user.shipping_floor_number:"")}
              </div>       
            </div>
            {/* additional info */}
            <div className="py-2"><Sentence text="Additional Location Information"/></div>
            <textarea name="additional_location_info" className="w-full py-2 px-2 text-sm border border-gray-200 rounded-xl placeholder:text-sm placeholder:text-gray-300 focus:outline-none" rows={5} placeholder="Type info here..."/>
            {/* phone number */}
            <div className="pt-4">
              <Sentence text="Phone Number"/>
              <Spacer gapsize="1"/>
              {settingsInput('phone_number', user.shipping_phone_number?user.shipping_phone_number:'E.g. 0700123789','tel', 10, '[0-9]')}
            </div>
          </div>

          {/* save changes */}
          <div className="pt-8 flex justify-end">
            <button type="submit" className="px-4 py-2 text-sm text-white font-semibold bg-peach rounded-xl">{
              transition.submission?
              <div className="flex gap-2 items-center">
                <p>Saving</p>
                <SuperSpinner innercolor="peach" outercolor="white"/>
                </div>
              :
            `Save Changes`
            }</button>
          </div>
        
        </Form>
    </main>
  )
}
