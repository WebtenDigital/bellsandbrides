import { registry_store } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useTransition } from "@remix-run/react";
import Heading from "~/components/dashboard/Heading";
import RegistryManagementCard from "~/components/dashboard/RegistryManagementCard";
import dashimages from "~/utils/dashimages";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const userId=session.get('userId');
    
    const formdata=await request.formData();
    const itemId=formdata.get('item_id')?.toString();

    // remove id that corresponds to the one whose bin has been clicked
    if(userId&&itemId){
        const deleteFromSelected=await db.user_registry_store.deleteMany({
            where: {
                registry_item_id: parseInt(itemId)
            }
        });
    }

    return json({
        data: {
            
        }
    })
}

// Loader
export const loader:LoaderFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));
    const sessionId=session.get('userId');

    const userregistryitems=await db.user_registry_store.findMany({
        where: {
            user_id: parseInt(sessionId)
        }
    });
    
    const allregistryitems=await db.registry_store.findMany();

    const userregistryitemsids=userregistryitems.map(item=>item.registry_item_id);

    const selecteditems=allregistryitems.filter(item=>userregistryitemsids.includes(item.id));

    return json({
        data: {
            selectedregistryitems:selecteditems
        }
    })
}

type LoaderData={
    data: {
        selectedregistryitems:registry_store[]
    }
}

// CLIENT
export default function ManageRegistry() {
    const loaderdata=useLoaderData<LoaderData>();
    const selectedregistryitems=loaderdata.data.selectedregistryitems;
    const transition=useTransition();

  return (
    <main className="w-11/12 mx-auto">
        <Heading type="main" text="Manage Registry"/>

        {
            transition.submission&&<div className="w-7/12 mx-auto py-4 px-4 fixed inset-x-0 bg-red-500 text-sm text-white text-center font-semibold shadow-xl z-10 ">{`Removing...`}</div>
        }

        {/* selected items */}
        <div className="pt-4 pb-20">
            {
                selectedregistryitems.length?selectedregistryitems.map(item=>{
                    return <div className="py-2"><RegistryManagementCard id={item.id} imageurl={item.item_image?item.item_image:""} name={item.item_name} category={item.item_category} price={item.item_price}/></div>
                })
                :
                <div className="w-9/12 mx-auto">
                    <div className="w-9/12 mx-auto"><img src={dashimages.box} alt="empty box"/></div>
                    <h3 className="text-xl text-gray-700 font-bold">No Items In Your Registry</h3>
                    <p className="pt-2 pb-4 text-sm text-justify">Visit our registry store to find items that you would like your guests to gift you on your special day.</p>
                    <div className="text-sm flex items-center justify-center gap-2 text-peach font-semibold">
                        <Link to="/shop">Start Adding Items</Link>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            }
        </div>
    </main>
  )
}
