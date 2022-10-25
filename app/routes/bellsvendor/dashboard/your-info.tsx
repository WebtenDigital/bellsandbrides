import { vendors } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import Heading from "~/components/dashboard/Heading";
import FormField from "~/components/FormField";
import SuperSpinner from "~/components/SuperSpinner";
import { db } from "~/utils/db.server";
import { vendorsessionstorage } from "~/utils/session";
import { vendorCategories } from "~/utils/vendorcategories";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const session=await vendorsessionstorage.getSession(request.headers.get("Cookie"));
    const vendorid=parseInt(session.get("vendor_id")?.toString());

    const formdata=await request.formData();
    const vendorname=formdata.get("vendor_name")?.toString();
    const category=formdata.get("category")?.toString();
    const businessaddress=formdata.get("business_address")?.toString();
    const ownerfirstname=formdata.get("owner_firstname")?.toString();
    const vendorphonenumber=formdata.get("vendor_phone_number")?.toString();
    const vendoremail=formdata.get("vendor_email")?.toString();
    const website=formdata.get("website")?.toString();
    const instagramhandle=formdata.get("instagram_handle")?.toString();
    const facebooklink=formdata.get("facebook_link")?.toString();
    const twitterlink=formdata.get("twitter_link")?.toString();
    const instagramlink=formdata.get("instagram_link")?.toString();
    const about=formdata.get("about")?.toString();

    const thisvendor=await db.vendors.findUnique({
        where: {
            id: vendorid
        }
    });

    const updatevendor=await db.vendors.update({
        where: {
            id: vendorid
        },
        data: {
            vendor_name: vendorname?vendorname:thisvendor?.vendor_name,
            category: category?category:thisvendor?.category,
            business_address: businessaddress?businessaddress:thisvendor?.business_address,
            owner_firstname: ownerfirstname?ownerfirstname:thisvendor?.owner_firstname,
            vendor_phone_number: vendorphonenumber?vendorphonenumber:thisvendor?.vendor_phone_number,
            vendor_email: vendoremail?vendoremail:thisvendor?.vendor_email,
            website: website?website:thisvendor?.website,
            instagram_handle: instagramhandle?instagramhandle:thisvendor?.instagram_handle,
            facebook_link: facebooklink?facebooklink:thisvendor?.facebook_link,
            twitter_link: twitterlink?twitterlink:thisvendor?.twitter_link,
            instagram_link: instagramlink?instagramlink:thisvendor?.instagram_link,
            about: about?about:thisvendor?.about
        }
    });

    // console.log(vendorname, category, businessaddress, ownerfirstname, vendorphonenumber, vendoremail, website, instagramhandle, facebooklink, twitterlink, instagramlink);

    return null;
}

// Loader
export const loader:LoaderFunction=async({request})=>{
    const session=await vendorsessionstorage.getSession(request.headers.get("Cookie"));
    const vendorid=session.get("vendor_id");

    if(vendorid){
        const thisvendor=await db.vendors.findUnique({
            where: {
                id: parseInt(vendorid.toString())
            }
        });

        return json({
            data: {
                thisvendor: thisvendor
            }
        });
    }
    else return redirect("/bellsvendor/myaccount");
}

type LoaderData={
    data: {
        thisvendor: vendors
    }
}

// CLIENT
export default function YourInfo() {
    const loaderdata=useLoaderData<LoaderData>().data;

    const thisvendor=loaderdata.thisvendor;

    const [businesscategory, setBusinessCategory]=useState(thisvendor.category?thisvendor.category:"");
    const [showdropdown, setShowDropDown]=useState(false);

    const transition=useTransition();

    return (
        <main>
            <div className="w-11/12 mx-auto">
                <div className="py-8"><Heading type="main" text="Your Information"/></div>
                <div>
                    <Form method="post">
                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Business Name"/></div>
                            <FormField type="text" name="vendor_name" required={false} placeholder={thisvendor.vendor_name?thisvendor.vendor_name:"Enter Business Name"}/>
                        </div>

                        <div className="relative py-4">
                            <div className="pb-2">
                                <Heading type="sub" text="Business Category"/>
                            </div>
                            <input type="hidden" name="category" value={businesscategory}/>
                            <button type="button" onClick={()=>{setShowDropDown(prevstate=>prevstate=!prevstate);}} className="block w-full flex items-center justify-between px-2 py-2 border border-gray-300 rounded-xl">
                                <p className="text-sm text-gray-400">{businesscategory?businesscategory:"Enter Business Category"}</p>
                                <div>
                                    {showdropdown?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>                                  
                                    :<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>}
                                </div>
                            </button>
                            {showdropdown&&<div className="py-2 absolute -mt-2 top-20 bg-gray-100 z-10 rounded-xl">
                                {
                                    vendorCategories.map(category=>{
                                        return (
                                            <button type="button" onClick={(event)=>{setBusinessCategory(event.currentTarget.textContent?event.currentTarget.textContent:""); setShowDropDown(false)}} className="block pl-4 pr-12 py-1 text-sm text-gray-600">{category}</button>
                                        )
                                    })
                                }
                            </div>}
                        </div>

                        <div id="about" className="py-4">
                            <div className="pb-2"><Heading type="sub" text="About Your Business"/></div>
                            <textarea rows={8} name="about" className="w-full px-2 py-3 text-sm text-gray-600 border border-gray-200 rounded-xl placeholder:text-gray-400 placeholder:text-sm focus:outline-none" required={false} placeholder="What Best Describes Your Business"/>
                        </div>

                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Business Address"/></div>
                            <FormField type="text" name="business_address" required={false} placeholder={thisvendor.business_address?thisvendor.business_address:"Enter Business Address"}/>
                        </div>

                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Business Owner"/></div>
                            <FormField type="text" name="owner_firstname" required={false} placeholder={thisvendor.owner_firstname?thisvendor.owner_firstname:"Enter Your Name"}/>
                        </div>

                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Telephone Number"/></div>
                            <FormField type="text" name="vendor_phone_number" required={false} placeholder={thisvendor.vendor_phone_number?thisvendor.vendor_phone_number:"Enter Phone Number"}/>
                        </div>

                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Email"/></div>
                            <FormField type="email" name="vendor_email" required={false} placeholder={thisvendor.vendor_email?thisvendor.vendor_email:"Enter Email"}/>
                        </div>

                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Website"/></div>
                            <FormField type="text" name="website" required={false} placeholder={thisvendor.website?thisvendor.website:"Enter Website"}/>
                        </div>

                        <div className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Instagram Handle"/></div>
                            <FormField type="text" name="instagram_handle" required={false} placeholder={thisvendor.instagram_handle?thisvendor.instagram_handle:"Enter Instagram Handle"}/>
                        </div>

                        <div id="social-links">
                            <div className="py-4">
                                <div className="pb-2"><Heading type="sub" text="Facebook Link"/></div>
                                <FormField type="text" name="facebook_link" required={false} placeholder={thisvendor.facebook_link?thisvendor.facebook_link:"Enter Facebook Link"}/>
                            </div>

                            <div className="py-4">
                                <div className="pb-2"><Heading type="sub" text="Twitter Link"/></div>
                                <FormField type="text" name="twitter_link" required={false} placeholder={thisvendor.twitter_link?thisvendor.twitter_link:"Enter Twitter Link"}/>
                            </div>

                            <div className="py-4">
                                <div className="pb-2"><Heading type="sub" text="Instagram Link"/></div>
                                <FormField type="text" name="instagram_link" required={false} placeholder={thisvendor.instagram_link?thisvendor.instagram_link:"Enter Instagram Link"}/>
                            </div>                            
                        </div>
                        <div className="py-4 flex justify-between">
                            <div className="w-6/12"></div>
                            <div className="w-6/12"><button type="submit" className="w-full py-2 text-center bg-purple-600 text-white text-sm font-bold rounded-xl">{transition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="purple-600"/>Saving...</div>:"Save"}</button></div>
                        </div>
                    </Form>
                </div>
                
            </div>
        </main>
    )
}

