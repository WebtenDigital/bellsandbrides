import { users, user_vendors, vendor_categories } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Heading from "~/components/dashboard/Heading";
import VendorCategory from "~/components/dashboard/VendorCategory";
import VendorSearch from "~/components/VendorSearch";
import Spacer from "~/components/Spacer";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";
import { vendorCategories } from "~/utils/vendorcategories";
import VendorSearchNoIcons from "~/components/dashboard/VendorSearchNoIcons";
import DashboardMainSideMenu from "~/components/dashboard/DashboardMainSideMenu";

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

  const currentuser=await db.users.findUnique({
    where: {
      id: sessionId
    }
  })

  return {
    data: {
      heartedVendors: heartedVendors,
      currentuser: currentuser
    }
  }
}


type LoaderData={
  data: {
    heartedVendors: user_vendors[]
    currentuser: users
  }
}

// CLIENT
export default function VendorIndex() {
  const loaderdata:LoaderData=useLoaderData();
  const allCategories=vendorCategories;
  const currentuser=loaderdata.data.currentuser;

  const heartedVendors=loaderdata.data.heartedVendors;

  function howManyVendorsIn(category:string){
    const categoryVendors=heartedVendors.filter(vendor=>vendor.vendor_category?.toLowerCase()===category.toLowerCase())
    const length=categoryVendors.length;

    return length;
  }

  const maincontent=<div>

    <div className="flex">
      <div className="w-6/12"></div>
      <div className="ml-20 w-6/12">dumebi</div>
    </div>
    
    {/* <main>
    <div className="lg:py-12">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-4/12"><Heading type="main" text="Vendor Manager"/></div>
              <div className="lg:hidden"><Spacer gapsize="2"/></div>
              <div className="hidden lg:block lg:w-7/12"><VendorSearchNoIcons/></div>
              <div className="lg:hidden"><VendorSearch/></div>
            </div>
            <div className="lg:py-4">
              <div className="pt-8 pb-4"><Heading type="sub" text="All Vendor Categories"/></div>
              <div className="pt-4">
                  <div className="grid grid-cols-3 gap-3 lg:grid lg:grid-cols-4 lg:gap-5">
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
            </div>
            <div className="lg:hidden"><Spacer gapsize="10"/></div>       
        </div>
    </main> */}
  </div>

  return (
    <div className="pt-4"><DashboardMainSideMenu maincontent={maincontent} firstname={currentuser.firstname?currentuser.firstname:""} partnerfirstname={currentuser.partnerfirstname?currentuser.partnerfirstname:""} ceremony={currentuser.ceremony?currentuser.ceremony:""} /></div>
    )
}
