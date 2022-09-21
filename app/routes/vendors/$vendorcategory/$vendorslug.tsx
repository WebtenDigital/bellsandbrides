import { vendors } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

// SERVER
// Loader
export const loader:LoaderFunction=async({params})=>{
    const slug=params.vendorslug;
    
    const thevendor=await db.vendors.findFirst({
        where: {
            slug: slug
        }
    });

    return json({
        data: {
            thevendor: thevendor
        }
    });
}

type LoaderData={
    data: {
        thevendor: vendors
    }
}

export default function DynamicVendor() {
    const loaderdata=useLoaderData<LoaderData>();
    const vendor=loaderdata.data.thevendor;

  return (
    <main>
        <div><img src={""}/></div>
        <div>{vendor.vendor_name}</div>
    </main>
  )
}
