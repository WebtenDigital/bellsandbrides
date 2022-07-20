import { user_vendors, vendors } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Heading from "~/components/dashboard/Heading";
import VendorSearch from "~/components/dashboard/VendorSearch";
import FilterOption from "~/components/FilterOption";
import Nav from "~/components/Nav";
import VendorCard from "~/components/VendorCard";
import { checkIfLoggedIn } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";
import { vendorCategories, vendorPriceTiers } from "~/utils/vendorcategories";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=session.get('userId');

    const formdata=await request.formData();
    const searchedvalue=formdata.get('search')?.toString();
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
            searchedvalue: searchedvalue,
        }
    });

}

// Loader
export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    // all vendors
    const allVendors=await db.vendors.findMany();

    // url params
    const url=new URL(request.url);
    const paramcategory=url.searchParams.get('category');

    // this user's Vendors - only query if loggedin
    if(sessionId){
        const userVendors=await db.user_vendors.findMany({
            where: {
                user_id: sessionId
            }
        });

        return json({
            data: {
                loggedin: await checkIfLoggedIn(session),
                allVendors: allVendors,
                userVendors: userVendors,
                paramcategory: paramcategory,
            }
        });
    }
    else{
        return json({
            data: {
                loggedin: await checkIfLoggedIn(session),
                allVendors: allVendors,
                paramcategory: paramcategory,
            }
        });
    }

}

type LoaderData={
    data: {
        loggedin: boolean
        allVendors: vendors[]
        userVendors?: user_vendors[]
        paramcategory: string
    }
}

export default function Vendors() {
    const loaderdata=useLoaderData<LoaderData>();
    const loggedin=loaderdata.data.loggedin;
    const userVendors=loaderdata.data.userVendors;
    const allVendors=loaderdata.data.allVendors;
    const paramcategory=loaderdata.data.paramcategory;

    // FILTERING
    // current category
    const [currentcategory, setCurrentCategory]=useState(paramcategory?paramcategory:'');
    const [currentpricetier, setCurrentPriceTier]=useState('');

    // filter by options dropdown
    // here, the chosen category will be placed in state, which will be used to determine which tier to show
    type OptionToFilter={
        categoryname: 'category'|'price'|'reviews'
        options: string[]
    }
    
    const optionsToFilter:OptionToFilter[]=[
        {
            categoryname: 'category',
            options: vendorCategories
        },
        {
            categoryname: 'price',
            options: vendorPriceTiers(currentcategory)
        },
        {
            categoryname: 'reviews',
            options: ['highest rating', 'lowest rating']
        }
    ];

    function handleOptionClick(value:string, filtertype:string){
        if(filtertype==='category'){
            setCurrentCategory(prevstate=>prevstate=value.toLowerCase());
        }
        else if(filtertype==='price'){
            setCurrentPriceTier(value);          
        }
    }

    function basePriceFilter(tier:string, baseprice:number){
        switch(tier.toLowerCase()){
            case 'under UGX 200K'.toLowerCase():
                return baseprice<200000;
            case 'UGX 200K - UGX 500K'.toLowerCase():
                return baseprice>=200000&&baseprice<=500000;
            case 'UGX 500K - UGX 1M'.toLowerCase():
                return baseprice>=500000&&baseprice<=1000000;
            case 'UGX 500K+'.toLowerCase():
                return baseprice>=500000;
            case 'under UGX 1M'.toLowerCase():
                return baseprice<1000000;
            case 'UGX 1M+'.toLowerCase():
                return baseprice>=1000000;
            case 'UGX 1M - UGX 2M'.toLowerCase():
                return baseprice>=1000000&&baseprice<=2000000;
            case 'UGX 2M+'.toLowerCase():
                return baseprice>=2000000;
            default:
                return baseprice>0;
        }
    }
    
    return (
        <main className="w-11/12 mx-auto">
            {<div>
            <Nav loggedin={loggedin}/>

            {/* SEARCH */}
            <div className="py-5"><VendorSearch/></div>

            {/* RESULTS */}
            <div className="pt-4 "><Heading type="main" text={currentcategory?`${currentcategory} Vendors`:"All Vendors"}/></div>

            {/* FILTER */}
            <div className="py-4 flex items-center justify-between">
                {
                    optionsToFilter.map(option=>{
                        return (
                            <FilterOption filtername={option.categoryname} filteroptions={option.options} handleClick={handleOptionClick}/>
                        )
                    })
                }
            </div>

            {/* CHOSEN FILTER OPTIONS */}
            {(currentcategory||currentpricetier)&&<div className="py-3 flex items-start justify-between">
                <div>
                    {/* {!currentcategory&&!currentpricetier&&<div></div>} */}
                    {currentcategory&&<p className="text-xs text-gray-500 font-semibold uppercase">Category: <span className="text-sm text-pink-400 font-normal capitalize italic">{currentcategory}</span></p>}
                    {currentpricetier&&<p className="text-xs text-gray-500 font-semibold uppercase">Starting Price: <span className="text-xs text-pink-400 font-normal uppercase italic">{currentpricetier}</span></p>}
                </div>
                {(currentcategory||currentpricetier)&&<button className="flex items-center gap-2" onClick={()=>{setCurrentCategory(''); setCurrentPriceTier('')}}>
                    <p className="text-gray-600 text-xs font-semibold uppercase">All vendors</p>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </button>}
            </div>}
    
    
            {/* VENDOR RESULTS */}
            {
                <div id="vendor-results">                
                    {/* EXPERIMENTAL VERSION */}
                    {
                        // scenario 1 -- no category, no price filter
                        !currentcategory&&!currentpricetier&&allVendors.map(vendor=>{
                            const userVendorByVendorId=userVendors?.map(item=>item.vendor_id); //give me all the vendor Ids for this user
                            const likedstatus=userVendorByVendorId?.includes(vendor.id); //if this vendor's id is present in the vendorUser table, set true
    
                            return (
                                <div className="py-4">
                                    <VendorCard currentlikedstatus={likedstatus ? 'liked' : 'unliked'} loggedin={loggedin} vendorId={vendor.id} vendorname={vendor.vendor_name} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""}/>
                                </div>
                            )
                        })
                    }
                    {
                        // scenario 2 -- category set but no price filter
                        currentcategory&&!currentpricetier&&allVendors.map(vendor=>{
                            const userVendorByVendorId=userVendors?.map(item=>item.vendor_id); //give me all the vendor Ids for this user
                            const likedstatus=userVendorByVendorId?.includes(vendor.id); //if this vendor's id is present in the vendorUser table, set true
    
                            return (
                                vendor.category?.toLowerCase()===currentcategory.toLowerCase()&&<div className="py-4">
                                    <VendorCard currentlikedstatus={likedstatus ? 'liked' : 'unliked'} loggedin={loggedin} vendorId={vendor.id} vendorname={vendor.vendor_name} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""}/>
                                </div>
                            )
                        })
                    }
                    {
                        // scenario 3 -- category set and price filter set
                        currentcategory&&currentpricetier&&allVendors.map(vendor=>{
                            const userVendorByVendorId=userVendors?.map(item=>item.vendor_id); //give me all the vendor Ids for this user
                            const likedstatus=userVendorByVendorId?.includes(vendor.id); //if this vendor's id is present in the vendorUser table, set true
    
                            return (
                                vendor.category?.toLowerCase()===currentcategory.toLowerCase()&&(basePriceFilter(currentpricetier, vendor.base_price?vendor.base_price:0))&&<div className="py-4">
                                    <VendorCard currentlikedstatus={likedstatus ? 'liked' : 'unliked'} loggedin={loggedin} vendorId={vendor.id} vendorname={vendor.vendor_name} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""}/>
                                </div>
                            )
                        })
                    }
                    {
                        // scenario 4 -- no category but price filter set
                        !currentcategory&&currentpricetier&&allVendors.map(vendor=>{
                            const userVendorByVendorId=userVendors?.map(item=>item.vendor_id); //give me all the vendor Ids for this user
                            const likedstatus=userVendorByVendorId?.includes(vendor.id); //if this vendor's id is present in the vendorUser table, set true
    
                            return (
                                (basePriceFilter(currentpricetier, vendor.base_price?vendor.base_price:0))&&<div className="py-4">
                                    <VendorCard currentlikedstatus={likedstatus ? 'liked' : 'unliked'} loggedin={loggedin} vendorId={vendor.id} vendorname={vendor.vendor_name} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""}/>
                                </div>
                            )
                        })
                    }
                </div>
            }
            </div>}
        </main>
      )
}
