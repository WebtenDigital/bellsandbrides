import { user_vendors, vendors } from "@prisma/client"
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Heading from "~/components/dashboard/Heading"
import Sentence from "~/components/dashboard/Sentence"
import { setIcon } from "~/components/dashboard/VendorCategory"
import Footer from "~/components/Footer"
import VendorCard from "~/components/VendorCard"
import VendorSearch from "~/components/VendorSearch"
import { checkIfLoggedIn } from "~/utils/auth.server"
import bannerimages from "~/utils/bannerimages"
import { db } from "~/utils/db.server"
import { storage } from "~/utils/session"
import { vendorCategories } from "~/utils/vendorcategories"

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=session.get('userId');

    const formdata=await request.formData();
    // const searchedvalue=formdata.get('search')?.toString();
    const likedstatus=formdata.get('likedstatus')?.toString();
    const vendorId=formdata.get('vendor_id')?.toString();
    const vendorCategory=formdata.get('vendor_category')?.toString();

    // add liked vendor to user_vendors
    if(likedstatus==='liked'){
        const createUserVendorJoiner=await db.user_vendors.create({
            data:{
                user_id: parseInt(sessionId),
                vendor_id: parseInt(vendorId?vendorId:""),
                vendor_category: vendorCategory
            }
        });
    }
    else if(likedstatus==='unliked'){
        const deleteVendor=await db.user_vendors.deleteMany({
            where: {
                vendor_id: parseInt(vendorId?vendorId:""),
                user_id: parseInt(sessionId)
            }
        });
    }


    return json({
        data: {
            // searchedvalue: searchedvalue,
        }
    });

}


// loader
export const loader:LoaderFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    const featuredvendors=await db.vendors.findMany({
        where: {
            featured: 1
        }
    });

    const uservendors=await db.user_vendors.findMany();

    return json({
        data: {
            featuredvendors: featuredvendors,
            loggedin: await checkIfLoggedIn(session),
            uservendors: uservendors
        }
    });
}

type LoaderData={
    data: {
        featuredvendors: vendors[]
        loggedin: boolean
        uservendors: user_vendors[]
    }
}

// CLIENT
export default function VendorsIndex() {
    const loaderdata=useLoaderData<LoaderData>();
    const featuredvendors=loaderdata.data.featuredvendors;
    const uservendors=loaderdata.data.uservendors;

    const uservendorsbyid=uservendors.map(vendor=>vendor.vendor_id);

  return (
    <main>
        <div id="hero" className="">
            <div className=""><img src={bannerimages.vendorindex} alt="" className="h-48 w-full object-cover object-top"/></div>
            <div className="py-6 bg-gray-50">
                <div className="w-11/12 mx-auto">
                    <div><Heading type="main" text="Vendors"/></div>
                    <div className="pt-4 pb-6 text-justify"><Sentence text="Bells and Brides has verified every service provider listed. We have made sure that we only provide the best vendors around. Start your search to start putting together a team that will bring your special day to life."/></div>
                    <div><VendorSearch/></div>
                </div>
            </div>
        </div>

        {/* categories */}
        <div id="categories" className="w-11/12 mx-auto py-10">
            <div><Heading type="sub" text="categories"/></div>
            <div className="py-2 grid grid-cols-3 ">
                {
                    vendorCategories.map(category=>{
                        return (
                            <div className="py-3">
                                <Link to={`/vendors/${category.toLowerCase()}`}>
                                    <div className="w-full mx-auto h-20 w-20 bg-pink-300 rounded-full">
                                        <div className="pt-3 pl-4">{setIcon(category)}</div>
                                    </div>
                                    <p className="pt-1 text-center text-sm text-gray-600 font-medium">{category}</p>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>

        {/* featured vendors */}
        <div className="w-11/12 mx-auto">
            <div><Heading type="sub" text="featured"/></div>
            <div className="py-4">
                {
                    featuredvendors.map(vendor=>{
                        return (
                            <div className="py-3"><VendorCard currentlikedstatus={uservendorsbyid.includes(vendor.id)?"liked":"unliked"} vendorId={vendor.id} vendorname={vendor.vendor_name?vendor.vendor_name:""} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""} loggedin={loaderdata.data.loggedin}/></div>
                        )
                    })
                }
            </div>

        </div>

        {/* footer */}
        <footer><Footer/></footer>
    </main>
  )
}
