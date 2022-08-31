import { registry_store } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import Heading from "~/components/dashboard/Heading";
import RegistryItemCard from "~/components/dashboard/RegistryItemCard";
import FilterOption from "~/components/FilterOption";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
export const action:ActionFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const userId=session.get('userId');

    const formdata=await request.formData();
    const itemId=formdata.get('item_id')?.toString();

    // if item has not beed added already, add item to user_registry_items
    if(userId&&itemId){
        const itemexists=await db.user_registry_store.findFirst({
            where: {
                registry_item_id: parseInt(itemId)
            }
        });

        if(!itemexists){
            const addtouserregistryitems=await db.user_registry_store.create({
                data: {
                    user_id: parseInt(userId),
                    registry_item_id: parseInt(itemId)
                }
            });
        }
        else{
            return json({
                data: {
                    message: 'Already added!'
                }
            });
        }
    }
    
    return json({
        data: {

        }
    });
}

export const loader:LoaderFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const userId=session.get('userId');

    const featureditems=await db.registry_store.findMany({
        where: {
            featured: 1
        }
    });

    // const userregistryitems=await db.user_registry_store.findMany({
    //     where: {
    //         user_id: parseInt(userId)
    //     }
    // });
    
    // console.log("current items:"+userregistryitems.length);

    return json({
        data: {
            featureditems: featureditems
        }
    });
}

function handleOptionClick(value:string, filtertype:string){

}

type ActionData={
    data: {
        message: string
    }
}

type LoaderData={
    data: {
        featureditems: registry_store[]
    }
}

// CLIENT
export default function Shop() {
    const loaderdata=useLoaderData<LoaderData>();
    const actiondata=useActionData<ActionData>();

    const transition=useTransition();

    const featuredregistryitems=loaderdata.data.featureditems;

    return (
        <main>
            <div className="pb-2"><CategoryMenu for="Registry Store" heading="Registry Categories" /></div>
            <section className="pt-4 pb-20 px-4 bg-white shadow-lg rounded-lg">
                <div>
                    <Heading type="main" text="Shop"/>
                    <div className="py-4"><FilterOption filtername="Sort By" filteroptions={["Lowest Price", "Highest Price"]} handleClick={handleOptionClick}/></div>
                </div>

                <div className="py-2"><Heading type="sub" text="featured items"/></div>

                {
                    transition.submission&&<div className="w-7/12 mx-auto py-4 px-4 fixed inset-x-0 bg-green-500 text-sm text-white text-center font-semibold shadow-xl z-10">{actiondata?.data.message?actiondata.data.message:`Adding to Registry...`}</div>
                }

                {/* display the items */}
                {
                    featuredregistryitems.map(registryitem=>{
                        return (
                            <div className=" relative py-2">
                                <RegistryItemCard id={registryitem.id} name={registryitem.item_name} imageurl={registryitem.item_image?registryitem.item_image:""} category={registryitem.item_category} price={registryitem.item_price}/>
                            </div>
                        )
                    })
                }
            </section>
        </main>
    );
}
