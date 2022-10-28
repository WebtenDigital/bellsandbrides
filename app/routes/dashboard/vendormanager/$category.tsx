import { users, user_vendors, vendors } from "@prisma/client"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { useActionData, useLoaderData } from "@remix-run/react"
import CategoryMenu from "~/components/dashboard/CategoryMenu"
import DashboardLayout from "~/components/dashboard/DashboardLayout"
import DashVendorCard from "~/components/dashboard/DashVendorCard"
import Heading from "~/components/dashboard/Heading"
import Sentence from "~/components/dashboard/Sentence"
import VendorSearch from "~/components/dashboard/VendorSearchByName"
import Spacer from "~/components/Spacer"
import { dashboardvendormenu, dashmenucategories, mainvendormenu } from "~/utils/allmenus"
import { db } from "~/utils/db.server"
import { storage } from "~/utils/session"

export const action:ActionFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    // delete from user_vendors if likedstatus==='unliked'
    const formdata=await request.formData();
    const vendorId=formdata.get('vendor_id')?.toString();

    const deletedUnliked=await db.user_vendors.deleteMany({
        where: {
            vendor_id: parseInt(vendorId?vendorId:""),
            user_id: sessionId
        }
    });

    return {
        data: {
            
        }
    }
}

export const loader:LoaderFunction=async ({params, request})=>{
    const category=params.category;

    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    // this user's vendors that belong to this category
    const userVendors=await db.user_vendors.findMany({
        where: {
            user_id: sessionId,
            vendor_category: category?.toLowerCase()
        }
    });

    // instead of fetching all the vendors, fetch all the vendors that belong to this category
    const allVendors=await db.vendors.findMany({
        where: {
            category: category?.toLowerCase()
        }
    });

    // heartedvendors
    const heartedVendors=allVendors.filter(vendor=>userVendors.map(uservendor=>uservendor.vendor_id).includes(vendor.id));

    // user
    const currentuser=await db.users.findUnique({
        where: {
            id: sessionId
        }
    })

    return {
        data: {
            category: category,
            heartedVendors: heartedVendors,
            userVendors: userVendors,
            currentuser: currentuser
        }
    }
}

type LoaderData={
    data: {
        category: string,
        heartedVendors: vendors[]
        userVendors: user_vendors[]
        currentuser: users
    }
}

// CLIENT
export default function DynamicCategory() {
    const actiondata=useActionData();

    const loaderdata=useLoaderData<LoaderData>();
    const heartedVendors=loaderdata.data.heartedVendors;
    const userVendors=loaderdata.data.userVendors;
    const currentuser=loaderdata.data.currentuser;

    const maincontent=<div>

    </div>

  return (
    <main>
        {/* mobile */}
        <section id="mobile" className="lg:hidden">
            <CategoryMenu for="DashVendors" heading="Registry Options"/>
            <Spacer gapsize="1"/>
            <div className="bg-white shadow-xl rounded-lg">
                <div className="w-11/12 mx-auto pt-4 pb-8">
                    <Heading type="main" text={loaderdata?loaderdata.data.category:""}/>
                    <div className="py-2 pl-2"><Sentence text="Still looking around?"/></div>
                    <VendorSearch/>
                    <Spacer gapsize="3"/>
                    <div>
                        {
                            heartedVendors.map(vendor=>{
                                // const likedstatus=userVendors.map(uservendor=>uservendor.vendor_id).includes(vendor.id);
                                const likedstatus=heartedVendors.includes(vendor);
                                return (
                                    <DashVendorCard currentlikedstatus={likedstatus?'liked':'unliked'} vendorId={vendor.id} vendorname={vendor.vendor_name?vendor.vendor_name:""} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""}/>
                                );
                            })                    
                        }
                    </div>
                </div>
            </div>
        </section>

        {/* lg */}
        <section>
            <div className="hidden lg:block pt-2 w-11/12 mx-auto"><DashboardLayout menuheading="Categories" ceremony={currentuser.ceremony?currentuser.ceremony:""} leftmenuarray={dashmenucategories} maincontent={maincontent} title={loaderdata.data.category}/></div>
        </section>
    </main>
  )
}
