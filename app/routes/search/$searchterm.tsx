import { user_vendors, vendors } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react";
import VendorCard from "~/components/VendorCard";
import { checkIfLoggedIn } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
// Action
export const action:ActionFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    const formdata=await request.formData();

    // on clicking the heart, add or remove from the user_vendors table
    const likedstatus=formdata.get('likedstatus')?.toString();
    const vendorId=formdata.get('vendor_id')?.toString();
    const vendorCategory=formdata.get('vendor_category')?.toString();

    // add liked vendor to user_vendors
    if(likedstatus==='liked'){
        const createUserVendorJoiner=await db.user_vendors.create({
            data:{
                user_id: sessionId,
                vendor_id: parseInt(vendorId?vendorId:""),
                vendor_category: vendorCategory
            }
        });
    }
    else if(likedstatus==='unliked'){
        const deleteVendor=await db.user_vendors.deleteMany({
            where: {
                vendor_id: parseInt(vendorId?vendorId:""),
                user_id: sessionId
            }
        });
    }

    return {
        data: {

        }
    }
}

// Loader
export const loader:LoaderFunction=async ({params, request})=>{
    const searchedvalue=params.searchterm?.toLowerCase();

    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    // loggedin status
    const loggedin=await checkIfLoggedIn(session);

    // query vendors for searched value
    const searchedVendors=await db.vendors.findMany({
        where: {
            vendor_name: {
                contains: searchedvalue
            }
        }
    });

    // all vendors hearted by this user
    if(loggedin){
        const heartedVendors=await db.user_vendors.findMany({
            where: {
                user_id: sessionId
            }
        });

        return {
            data: {
                loggedin: loggedin,
                searchedvalue: searchedvalue,
                searchedVendors: searchedVendors,
                heartedVendors: heartedVendors
            }
        }
    }
    else{
        return {
            data: {
                loggedin: loggedin,
                searchedvalue: searchedvalue,
                searchedVendors: searchedVendors,
            }
        }
    }
}

type LoaderData={
    data:{
        loggedin:boolean
        searchedvalue: string
        searchedVendors: vendors[]
        heartedVendors: user_vendors[]
    }
}

export default function DynamicSearchTerm(){
    const loaderdata=useLoaderData<LoaderData>();
    const loggedin=loaderdata.data.loggedin;
    const searchedvalue=loaderdata.data.searchedvalue;
    const searchedVendors=loaderdata.data.searchedVendors;
    const heartedVendors=loaderdata.data.heartedVendors;

  return (
    <main>
        <div className="flex items-center justify-between">
            <p className="pt-4 pb-6 text-xs text-gray-500 font-semibold uppercase">Results For: <span className="text-sm text-pink-400 font-normal capitalize italic">{searchedvalue}</span></p>
            <Link to="/vendors" className="flex items-center gap-2">
                <p className="text-gray-600 text-xs font-semibold uppercase">All vendors</p>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </Link>
        </div>
        {searchedVendors.length?<div>
            {
                searchedVendors.map(vendor=>{
                    // now, compare the two arrays: searchedVendors and heartedVendors

                    const likedstatus=heartedVendors?.map(vendor=>vendor.vendor_id).includes(vendor.id); //it is liked if the vendor's id is found in the user_vendors table
                    return (
                        <VendorCard currentlikedstatus={likedstatus ? 'liked' : 'unliked'} vendorId={vendor.id} vendorname={vendor.vendor_name} category={vendor.category ? vendor.category : ""} baseprice={vendor.base_price ? vendor.base_price : 0} slug={vendor.slug ? vendor.slug : ""} loggedin={loggedin}/>
                        )
                })
            }
        </div>
        :
        <div>No Results</div>}
    </main>
  )
}
