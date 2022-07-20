import { user_vendors, vendor_categories } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Heading from "~/components/dashboard/Heading";
import VendorCategory from "~/components/dashboard/VendorCategory";
import VendorSearch from "~/components/dashboard/VendorSearch";
import Spacer from "~/components/Spacer";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";
import { vendorCategories } from "~/utils/vendorcategories";

// SERVER
// Loader
export const loader:LoaderFunction=async ({request})=>{
  const sessionId=parseInt((await storage.getSession(request.headers.get('Cookie'))).get('userId'));

  // 1. get all of this user's vendors
  const heartedVendors=await db.user_vendors.findMany({
    where: {
      user_id: sessionId
    }
  });

  return {
    data: {
      heartedVendors: heartedVendors,
    }
  }
}


type LoaderData={
  data: {
    heartedVendors: user_vendors[]
  }
}

// CLIENT
export default function VendorIndex() {
  const loaderdata:LoaderData=useLoaderData();
  const allCategories=vendorCategories;

  const heartedVendors=loaderdata.data.heartedVendors;

  function howManyVendorsIn(category:string){
    const categoryVendors=heartedVendors.filter(vendor=>vendor.vendor_category===category.toLowerCase())
    const length=categoryVendors.length;

    return length;
  }

  return (
    <main>
        <div>
            <Heading type="main" text="Vendor Manager"/>
            <Spacer gapsize="2"/>
            <VendorSearch/>
            <div className="pt-8 pb-4"><Heading type="sub" text="All Vendor Categories"/></div>
            <div>
              <div className="grid grid-cols-3 gap-3">
                {
                  allCategories.map(categoryname=>{
                    return (
                      <div>
                        <VendorCategory categoryname={categoryname} howmanyvendors={howManyVendorsIn(categoryname)}/>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <Spacer gapsize="10"/>            
        </div>
    </main>
  )
}
