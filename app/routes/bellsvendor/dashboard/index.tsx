import {json, LoaderFunction, redirect } from "@remix-run/node";
import { vendorsessionstorage } from "~/utils/session";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import Sentence from "~/components/dashboard/Sentence";
import CTA from "~/components/dashboard/CTA";
import fb from '../../../images/others/fb-3d.png'
import { db } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import Heading from "~/components/dashboard/Heading";
import Separator from "~/components/Separator";

// SERVER
// Loader
export const loader:LoaderFunction=async({request})=>{
    const session=await vendorsessionstorage.getSession(request.headers.get("Cookie"));
    const vendorid=session.get("vendor_id")?.toString();

    if(vendorid){
    // check if social links are available in db
    const thisvendor=await db.vendors.findUnique({
        where: {
            id: parseInt(vendorid)
        }
    });

    const fb=thisvendor?.facebook_link;
    const tw=thisvendor?.twitter_link;
    const ig=thisvendor?.instagram_link;

    if(fb||tw||ig){
        return json({
            data: {
                sociallinksavailable: true
            }
        });
    }
    else if(!fb&&!tw&&!ig){
        return json({
            data: {
                sociallinksavailable: false
            }
        });
    }
    }
    else return redirect("/bellsvendor/myaccount");    
}

type LoaderData={
    data: {
        sociallinksavailable: boolean
    }
}

// CLIENT
export default function VendorDashboard() {
    const loaderdata=useLoaderData<LoaderData>();
    const sociallinksavailable=loaderdata.data.sociallinksavailable;

  return (
    <main className="w-11/12 mx-auto">
        <div className="py-8">
            <div><Sentence text="Welcome back to your vendor dashboard"/></div>
            {!sociallinksavailable&&<div className="my-4 bg-purple-100 rounded-2xl">
                <div className="w-11/12 mx-auto py-4">
                    <p className="text-white text-sm">Start by adding your social media links</p>
                    <div className="relative">
                        <div className="absolute top-0 left-0 -ml-4"><img src={fb} alt="facebook" className="h-24 w-full"/></div>
                        <div className="flex justify-end pt-4 pb-2"><CTA type="fillednoarrow" url="/bellsvendor/dashboard/your-info#social-links" text="Add Social Links" bgcolor="bg-purple-600"/></div>
                    </div>
                </div>
            </div>}

            <div className="py-12">
                <div><Heading text="Analytics" type="sub"/></div>
                <div className="py-3 text-justify"><Sentence text="See how many potential clients have checked your vendor profile on Bells and Brides."/></div>
                <div className="pt-4 pb-6 bg-gray-100 rounded-2xl">
                    <div className="w-11/12 mx-auto ">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                            </svg>
                        </div>
                        <div className="py-1"></div>
                        <div className="flex items-end gap-3">
                            <p className="text-3xl font-bold">123</p>
                            <div className="pb-1"><Sentence text="Profile Visits This Month"/></div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-4 pb-2"><CTA type="fillednoarrow" url="/bellsvendor/dashboard/analytics" text="See More" bgcolor="bg-purple-600"/></div>
            </div>

            <div>
                <div><Heading text="Advertising" type="sub"/></div>
                <div className="py-3 text-justify"><Sentence text="Boost your visibilty by placing your business at the forefront of the biggest wedding platform in the country."/></div>
                <div className="flex justify-end pt-4 pb-2"><CTA type="fillednoarrow" url="/bellsvendor/dashboard/ads" text="Contact Sales" bgcolor="bg-purple-600"/></div>
            </div>

            <div className="my-10 border-b border-gray-100"></div>

            <div>
                <div className="flex items-center justify-between">
                    <Heading text="Your Images" type="sub"/>
                    <div className="flex justify-end pt-4 pb-2"><CTA type="fillednoarrow" url="/bellsvendor/dashboard/your-images" text="Add Photo" bgcolor="bg-purple-600"/></div>
                </div>
                <div className="py-3 text-justify"><Sentence text="These photos will be displayed on your vendor profile."/></div>
            </div>
        </div>    
    </main>
  )
}
