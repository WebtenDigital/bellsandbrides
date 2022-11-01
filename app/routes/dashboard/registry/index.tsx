import { registry_store } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import CTA from "~/components/dashboard/CTA";
import Heading from "~/components/dashboard/Heading";
import RegistryGuideCard, { RegistryGuideItem } from "~/components/dashboard/RegistryGuideCard";
import RegistryItemCard from "~/components/dashboard/RegistryItemCard";
import Sentence from "~/components/dashboard/Sentence";
import Spacer from "~/components/Spacer";
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

// Loader
export const loader:LoaderFunction=async ({request})=>{
  const session=await storage.getSession(request.headers.get("Cookie"));
  const sessionId=parseInt(session.get('userId'));

  // if there is no registry name yet, redirect to regsitry/welcome
  const user=await db.users.findUnique({
    where: {
      id: sessionId
    }
  });

    // does this user have any items stored in the user_registry_items table yet?
    const registryexistence=await db.user_registry_store.findMany({
      where: {
        user_id: sessionId
      }
    });

    const showaddtoregistrycard=!registryexistence.length?true:false;
    const showshippingaddresscard=!user?.shipping_street_address?.length?true:false;

    const featuredregistryitems=await db.registry_store.findMany({
      where: {
        featured: 1
      }
    });

  if(!user?.registry_name){
    return redirect('/dashboard/registry/welcome');
  }
  else return json({
    data: {
      showaddtoregistrycard:showaddtoregistrycard,
      showshippingaddresscard: showshippingaddresscard,
      featuredregistryitems: featuredregistryitems
    }
  });
}

type LoaderData={
  data: {
    showaddtoregistrycard: boolean
    showshippingaddresscard: boolean
    featuredregistryitems: registry_store[]
  }
}

type ActionData={
  data: {
      message: string
  }
}

// CLIENT
export default function RegistryOverview() {
  const loaderdata=useLoaderData<LoaderData>();
  const actiondata=useActionData<ActionData>();

  const transition=useTransition();

  const registryguideitems:RegistryGuideItem[]=[
    {
      icon: <svg className="fill-peach h-10 w-10" viewBox="0 0 506.522 506.522"><path d="M497.989 475.128h-8.858c-2.423-63.428-31.531-120.047-76.476-159.01V255.25c0-27.827 6.886-55.535 19.9-80.128l4.753-8.969c13.184-24.917 13.414-53.606.623-78.729-12.792-25.131-36.139-41.822-64.043-45.807l-3.9-.555v-.478c0-14.481-11.776-26.257-26.257-26.257H191.446c-14.481 0-26.257 11.776-26.257 26.257v.478l-3.9.555c-27.904 3.985-51.251 20.676-64.043 45.807-12.791 25.122-12.561 53.811.623 78.729l4.745 8.969c13.022 24.593 19.908 52.301 19.908 80.128v60.305c-12.791 10.47-24.516 22.178-34.662 35.081L45.995 302.78c-4.369-4.983-10.675-7.979-17.297-8.192-6.665-.247-13.107 2.338-17.801 7.023l-3.857 3.866c-8.849 8.849-9.489 22.775-1.169 32.759 16.452 19.746 38.016 50.552 48.145 85.999-1.502 7.432-6.46 32.913-7.893 50.893h-8.934a8.536 8.536 0 0 0-8.533 8.533 8.536 8.536 0 0 0 8.533 8.533H497.99a8.536 8.536 0 0 0 8.533-8.533c-.001-4.71-3.823-8.533-8.534-8.533zm-230.4-119.467c-37.675 0-70.298-24.602-81.297-59.776a206.322 206.322 0 0 1 15.991-6.153c8.755 28.954 34.995 48.862 65.306 48.862 30.507 0 56.892-20.156 65.357-48.845a202.108 202.108 0 0 1 15.966 6.144c-10.838 35.03-43.546 59.768-81.323 59.768zm128-53.205c-7.492-5.291-15.368-9.958-23.415-14.268-1.647-.879-3.243-1.835-4.915-2.68-2.287-1.152-4.634-2.15-6.963-3.226-2.415-1.118-4.787-2.321-7.253-3.354l-.017.085a221.53 221.53 0 0 0-16.12-6.007l.017-.06c-.273-.094-.563-.154-.836-.239-3.268-1.067-6.596-1.937-9.907-2.85-2.261-.623-4.48-1.323-6.767-1.869-3.157-.759-6.366-1.331-9.566-1.954-2.483-.486-4.941-1.058-7.45-1.459-3.43-.546-6.903-.879-10.359-1.263-2.313-.256-4.582-.623-6.912-.811-2.987-.239-5.999-.265-9.003-.375v-25.933h25.6a8.536 8.536 0 0 0 8.533-8.533 8.536 8.536 0 0 0-8.533-8.533h-68.267a8.536 8.536 0 0 0-8.533 8.533 8.536 8.536 0 0 0 8.533 8.533h25.6v25.933c-42.897 1.664-84.506 15.633-119.467 40.328v-47.206c0-30.601-7.569-61.073-21.888-88.115l-4.745-8.969c-10.556-19.934-10.735-42.897-.503-63.002 10.24-20.104 28.919-33.459 51.251-36.651l1.553-.222c.051.614.222 1.195.307 1.801.12.776.222 1.544.401 2.295.213.905.512 1.766.819 2.637.247.717.486 1.434.794 2.116.384.836.845 1.621 1.306 2.406.375.64.725 1.289 1.152 1.886.529.76 1.143 1.434 1.758 2.133.469.538.913 1.109 1.442 1.613.674.649 1.425 1.212 2.167 1.792.555.435 1.075.905 1.664 1.289.828.546 1.724.964 2.603 1.417.597.299 1.161.657 1.783.913 1.024.427 2.108.708 3.191.998.546.145 1.067.367 1.63.478 1.673.341 3.405.529 5.171.529h152.286c1.766 0 3.499-.188 5.171-.529.563-.111 1.075-.333 1.63-.478 1.084-.29 2.167-.572 3.191-.998.623-.256 1.186-.614 1.783-.913.879-.452 1.775-.87 2.594-1.417.597-.384 1.118-.853 1.673-1.289.742-.58 1.493-1.143 2.167-1.792.521-.503.964-1.075 1.442-1.613.614-.7 1.229-1.374 1.758-2.133.427-.597.777-1.246 1.143-1.886.469-.785.93-1.57 1.314-2.406.307-.683.546-1.399.794-2.116.307-.87.606-1.732.819-2.637.179-.751.282-1.519.393-2.295.094-.606.265-1.186.316-1.801l1.553.222c22.332 3.191 41.011 16.546 51.251 36.651 10.231 20.105 10.052 43.068-.503 63.002l-4.745 8.969c-14.319 27.042-21.888 57.515-21.888 88.115v47.208z"/></svg>,
      title: "Add Items to Registry",
      description: "Visit our registry store to start adding to your wishlist.",
      url: "/shop",
      showcard:loaderdata.data.showaddtoregistrycard
    },
    {
      icon: <svg className="fill-peach h-10 w-10" viewBox="0 0 512.014 512.014"><path d="M511.596 486.499 468.93 273.166c-2.005-9.963-10.752-17.152-20.928-17.152h-82.923c1.707-2.645 3.392-5.355 5.077-8l12.16-19.136c15.061-23.808 23.019-51.307 23.019-79.531 0-42.496-18.176-83.115-49.92-111.445-31.701-28.31-74.368-41.877-116.864-36.885-66.368 7.552-121.216 61.013-130.389 127.104-5.44 39.168 4.352 78.059 27.541 109.547 4.395 5.952 8.341 12.224 12.523 18.347H64.002c-10.155 0-18.901 7.189-20.907 17.152L.428 486.499a21.306 21.306 0 0 0 4.416 17.707 21.354 21.354 0 0 0 16.491 7.808h469.333c6.4 0 12.437-2.88 16.512-7.808a21.45 21.45 0 0 0 4.416-17.707zM256.002 85.347c35.307 0 64 28.715 64 64s-28.693 64-64 64c-35.285 0-64-28.715-64-64s28.714-64 64-64zm-208.64 384L81.495 298.68h93.845c.064.107.128.235.192.341 13.696 23.232 26.411 47.019 38.016 69.547 4.907 9.621 9.813 19.2 14.699 28.949l8.683 17.365c3.627 7.232 10.987 11.797 19.072 11.797a21.355 21.355 0 0 0 19.093-11.797l18.389-36.779c4.928-9.835 10.176-19.584 15.531-29.291 1.536-2.773 3.072-5.568 4.608-8.299a1166.087 1166.087 0 0 1 13.931-23.936 1345.653 1345.653 0 0 1 10.859-17.899h92.117l34.133 170.667H47.362z"/><path d="M256.008 170.681c11.776 0 21.333-9.557 21.333-21.333s-9.557-21.333-21.333-21.333c-11.776 0-21.333 9.557-21.333 21.333s9.557 21.333 21.333 21.333z"/></svg>,
      title: "Set Shipping Address",
      description: "Let us know where we should deliver your gifts.",
      url: "/dashboard/registry/settings/#shipping-address",
      showcard:loaderdata.data.showshippingaddresscard
    },
    {
      icon: <svg className="fill-peach h-10 w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 17c2.269-9.881 11-11.667 11-11.667v-3.333l7 6.637-7 6.696v-3.333s-6.17-.171-11 5zm12 .145v2.855h-16v-12h6.598c.768-.787 1.561-1.449 2.339-2h-10.937v16h20v-6.769l-2 1.914z"/></svg>,
      title: "Share With Guests",
      description: "Make your registry live and available to your guests.",
      url: "/dashboard/registry/settings/#registry-link",
      showcard:true 
    },
    {
      icon: <svg className="fill-peach h-10 w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14.729l.855-1.151c1 .484 1.635.852 2.76 1.654 2.113-2.399 3.511-3.616 6.106-5.231l.279.64c-2.141 1.869-3.709 3.949-5.967 7.999-1.393-1.64-2.322-2.326-4.033-3.911zm15-11.729v21h-20v-21h4.666l-2.666 2.808v16.192h16v-16.192l-2.609-2.808h4.609zm-3.646 4l-3.312-3.569v-.41c.001-1.668-1.352-3.021-3.021-3.021-1.667 0-3.021 1.332-3.021 3l.001.431-3.298 3.569h12.651zm-6.354-5c.553 0 1 .448 1 1s-.447 1-1 1-1-.448-1-1 .447-1 1-1z"/></svg>,
      title: "See Our Checklist",
      description: "Not sure what to add to your registry? See our checklist.",
      url: "/dashboard/registry/checklist",
      showcard:loaderdata.data.showaddtoregistrycard
    },
    {
      icon: <svg className="fill-peach h-10 w-10" viewBox="0 0 361.014 361.014"><path d="M331.035 126.94H318.01c-3.563 0-3.682-2.333-3.805-3.494C307.375 59.094 252.77 8.791 186.637 8.791h-12.26c-65.644 0-119.929 49.56-127.409 113.229-.191 1.631-.291 4.92-3.291 4.92H29.978C20.987 126.94 0 136.401 0 184.18v25.075c0 35.436 20.987 43.609 29.978 43.609h43.584c8.991 0 16.347-7.356 16.347-16.347v-93.23c0-8.991-7.356-16.347-16.347-16.347 0 0-2.052-.18-1.529-3.835 7.192-50.319 50.129-89.313 102.344-89.313h12.26c51.86 0 94.912 38.418 102.2 88.288.235 1.608 1.111 4.86-1.385 4.86-8.991 0-16.347 7.356-16.347 16.347v93.23c0 8.991 7.356 16.347 16.347 16.347h8.184c2.25 0 1.868 1.798 1.667 2.704-6.667 30.104-21.637 64.256-55.238 64.256h-24.889c-2.54 0-3.167-1.861-3.65-2.743-4.032-7.367-11.851-12.364-20.841-12.364h-22.933c-13.118 0-23.753 10.634-23.753 23.753s10.635 23.752 23.753 23.752h22.933c9.112 0 17.023-5.132 21.005-12.662.348-.658.633-2.026 3.321-2.026h25.054c22.823 0 53.365-11.341 69.259-65.373 1.694-5.758 3.068-11.496 4.187-17.026.154-.761.25-2.27 2.625-2.27h12.9c8.991 0 29.978-8.174 29.978-43.609v-25.075c-.001-47.099-20.988-57.241-29.979-57.241z"/></svg>,
      title: "Still Not Sure",
      description: "Not sure if you should set up a registry? Talk to our expert.",
      url: "/",
      showcard:loaderdata.data.showaddtoregistrycard
    },
  ];

  type RegistryType={

  }

  const featuredregistryitems=loaderdata.data.featuredregistryitems;

  return (
    <main>
        <section className="pt-4 pb-20 px-4 bg-white shadow-lg rounded-lg lg:shadow-none">
        <div>
            <Heading type="main" text="My Registry Overview"/>
        </div>
        <Spacer gapsize="4"/>
        <Heading type="sub" text="quick registry guide"/>
        <div id="the guide cards" className="lg:grid lg:grid-cols-2 lg:gap-x-10">
          {
            registryguideitems.map(item=>{
              return (
                <div className="pb-4 lg:py-5"><RegistryGuideCard showcard={item.showcard} icon={item.icon} title={item.title} description={item.description} url={item.url}/></div>
              )
            })
          }
        </div>

        {/* categories - gifts and cash funds */}
        <div className="pt-4 pb-10 lg:py-16">
          <Heading type="sub" text="categories"/>
          <Spacer gapsize="2"/>
          <div className="lg:flex lg:justify-between lg:items-center lg:gap-x-12">
            {
              [
                {
                  title: "gifts",
                  description: 'From kitchenware, to bathroom essentials, add the things you will need to (officially) start your life together.',
                  imageurl: dashimages.kitchenware,
                  linkurl: '/shop'
                },
                {
                  title: "cash fund",
                  description: 'Do you have some adventures on your bucketlist? Let your guests know by adding them to your registry.',
                  imageurl: dashimages.venue,
                  linkurl: '/honeymoon'
                }
              ].map(item=>{
                return (
                  <div className="w-9/12 mb-10">
                    <h2 className="text-sm text-gray-500 font-bold capitalize lg:py-2 lg:text-base">{item.title}</h2>                  
                    <Spacer gapsize="1"/>
                    <div className=""><img src={item.imageurl} alt={item.title} className="h-40 w-full object-cover rounded-3xl shadow-xl"/></div>
                    <p className="py-4 text-justify"><Sentence text={item.description}/></p>
                    <CTA type="filledwitharrow" url={item.linkurl} text={"Get Started"} />
                  </div>
                )
              })
            }
          </div>
        </div>

          {/* see checklist */}
          <div className="py-8 border-b border-t border-gray-100">
            <Heading type="sub" text="see our checklist"/>
            <div className="py-2 text-justify"><Sentence text="Looking for ideas on what to add to your registry? See our checklist for the items we recommend."/></div>
            <div className="flex justify-end"><CTA type="emptywitharrownoborder" url="/dashboard/registry/checklist" text="See Checklist"/></div>
          </div>
          {/* manage your registry */}
          <div className="my-10 pt-4 pb-8 bg-[#FFE9F6] rounded-xl lg:py-10">
            <div className="lg:w-10/12 mx-auto">
              <h2 className="text-gray-600 text-center font-bold lg:text-left">Manage Your Registry</h2>
              <div className="w-10/12 mx-auto pt-3 pb-6 text-center lg:text-left lg:w-full"><Sentence text="See who has bought you a gift from your registry, set where you want it to be sent, convert your gifts to store credit and more."/></div>
              {/* <div className="flex justify-center"><CTA type="empty" text="Manage Registry" url="/dashboard/registry/manage" bordercolor="peach" bgcolor=""/></div> */}
              <div className="w-10/12 mx-auto lg:w-6/12 lg:mx-0"><Link to="/dashboard/registry/manage"><div className="px-4 py-2 text-center text-sm text-white lg:text-base bg-[#FF88D0] rounded-xl">Manage Registry</div></Link></div>
            </div>
          </div>

          {/* personalized recommendations */}
          
          {
            transition.submission&&<div className="w-7/12 mx-auto py-4 px-4 inset-x-0 bg-green-500 text-sm text-white text-center font-semibold shadow-xl z-10">{actiondata?.data.message?actiondata.data.message:`Adding to Registry...`}</div>
          }

          <div className="pt-10 lg:py-16">
            <div className="lg:py-2"><Heading type="sub" text="Personalized Recommendations"/></div>
            <Spacer gapsize="1"/>
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
              {
                featuredregistryitems.map(item=>{
                  return (
                    <div className="py-2"><RegistryItemCard id={item.id} imageurl={item.item_image?item.item_image:""} name={item.item_name?item.item_name:""} category={item.item_category?item.item_category:""} price={item.item_price?item.item_price:0}/></div>
                  )
                })
              }
            </div>
          </div>
        </section>
    </main>
  )
}
