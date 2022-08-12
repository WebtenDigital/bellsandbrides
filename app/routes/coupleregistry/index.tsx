import { registry_store, users } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import CoupleRegistryItemCard from "~/components/CoupleRegistryItemCard";
import Heading from "~/components/dashboard/Heading";
import RegistryItemCard from "~/components/dashboard/RegistryItemCard";
import Sentence from "~/components/dashboard/Sentence";
import Nav from "~/components/Nav";
import Spacer from "~/components/Spacer";
import { db } from "~/utils/db.server";

// SERVER
export const loader:LoaderFunction=async({request})=>{
    const url=new URL(request.url);

    // const username=url.searchParams.get('ufn');
    // const partnername=url.searchParams.get('pfn');

    const userid=url.searchParams.get('uid');;

    // get this user's registry items
    const userregistrystore=await db.user_registry_store.findMany({
        where: {
            user_id: parseInt(userid?userid:"")
        }
    });

    // get the item ids
    const itemids=userregistrystore.map(item=>item.registry_item_id);

    // get the items from registry store db whose ids match the ones gotten above
    const registrystore=await db.registry_store.findMany();

    const registryitems=registrystore.filter(item=>itemids.includes(item.id));

    // registry name
    const user=await db.users.findUnique({
        where: {
            id: parseInt(userid?userid:"")
        }
    });

    // const registryname=user?.registry_name;

    return json({
        data: {
            registryitems: registryitems,
            user: user
        }
    });
}

type LoaderData={
    data: {
        registryitems: registry_store[]
        user: users
    }
}

// CLIENT
export default function CoupleRegistryIndex() {
    const loaderdata=useLoaderData<LoaderData>();
    const registryitems=loaderdata.data.registryitems;

    const registryname=loaderdata.data.user.registry_name;
    const welcomemessage=loaderdata.data.user.registry_welcome_message;

  return (
    <main className="w-11/12 mx-auto">
        <Nav loggedin={false}/>
        <div className="py-8">
            <Heading type="main" text={registryname?registryname:""}/>
            <Spacer gapsize="1"/>
            <Sentence text={welcomemessage?welcomemessage:"Welcome to our registry"}/>
        </div>
        <div>
            {
                registryitems.map(item=>{
                    return (
                        <div className="pb-2"><CoupleRegistryItemCard id={item.id} imageurl={item.item_image?item.item_image:""} name={item.item_name} category={item.item_category} price={item.item_price}/></div>
                    )
                })
            }
        </div>
    </main>
  )
}
