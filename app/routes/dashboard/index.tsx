import { posts, users } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import CTA from "~/components/dashboard/CTA";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import { storage } from "~/utils/session";
import dashimages from "~/utils/dashimages";
import { getPostsByCategory } from "~/utils/post.server";
import DashFooter from "~/components/dashboard/DashFooter";
import { getCeremony, getUser } from "~/utils/auth.server";

export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));

    // get user
    const theuser=await getUser(session);
    
    // get ceremony
    const ceremony=await getCeremony(session);

    // get posts by category
    const posts=await getPostsByCategory(ceremony?ceremony:"");

    if(theuser){
        return json({
            data: {
                user: theuser,
                posts: posts
            }
        })
    }
    else{
        return redirect('/myaccount')
    }
    
}

type LoaderData={
    data: {
        user: users
        posts:posts[]
    }
}

type VendorCard={
    imageurl: string
    categoryname: "Venue"|"Photography"|"Catering"
    url: string
}

const vendordashcards:VendorCard[]=[
    {
        imageurl: dashimages.venue,
        categoryname: "Venue",
        url: "/dashboard/vendors"
    },
    {
        imageurl: dashimages.photography,
        categoryname: "Photography",
        url: "/dashboard/vendors"
    },
    {
        imageurl: dashimages.catering,
        categoryname: "Catering",
        url: "/dashboard/vendors"
    }
]

export default function Dashboard() {
    const loaderdata:LoaderData=useLoaderData();
    const currentuser=loaderdata.data.user;
    // const loggedinstatus=loaderdata.data.user?true:false
    const posts=loaderdata.data.posts;

    return (
        <main className="bg-gray-50 min-h-screen pb-72">
            <div id="holder" className="w-11/12 mx-auto">
                <div>
                    <div className="py-4 capitalize">
                        <Heading type="main" text={`My ${currentuser.ceremony}`}/>
                    </div>
                </div>

                {/* Add Date -- this disappears once the date has been added */}
                {currentuser.ceremony_date?<div></div>:<div>
                    <div className="pt-2">
                        <Heading type="sub" text={`Have you set a date for your ${currentuser.ceremony}?`}/>
                        <div id="spacer" className="py-1"></div>
                        <div className="relative bg-pink-300 px-2 pt-2 pb-4 rounded-xl shadow-xl">
                            <div className="pb-5 px-2"><Sentence text="Start by adding the date for your function" className="text-white font-medium"/></div>
                            <div className="flex justify-end"><CTA type="filled" url="/dashboard/account/personal#date" text="Add Date"/></div>
                            <div className="absolute top-8 left-6 -rotate-12"><img src={dashimages.calendar} className="h-24 w-24"/></div>
                        </div>
                    </div>

                    <div id="spacer" className="py-10"></div>
                </div>}

                {/* Your Vendor Team */}
                <div>
                    <Heading type="sub" text="Your vendor team"/>
                    <div className="pt-2 pb-10"><Sentence text="Discover and contact the best local experts for your special day."/></div>
                    <div>
                        <div id="holder" className="relative mt-10 pt-28 pb-6 bg-gray-100 border border-gray-200 rounded-xl shadow-xl">
                            <div id="cards" className="absolute -top-10 left-3 flex gap-4">
                                {
                                    vendordashcards.map(dashcarditem=>{
                                        return (
                                            <Link to={dashcarditem.url} className="w-4/12">
                                                <img src={dashcarditem.imageurl} alt={dashcarditem.categoryname} className="w-24 h-24 rounded-3xl shadow-lg"/>
                                                <p className="mt-1 text-xs text-center text-gray-600 font-semibold">{dashcarditem.categoryname}</p>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                            <div id="ctas" className="w-11/12 mx-auto flex justify-between">
                                <CTA type="empty" url="/dashboard/vendors" text="Manage Vendors" bordercolor="peach"/>
                                <CTA type="filled" url="dashboard/vendors" text="Discover Vendors"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="spacer" className="py-8"></div>

                {/* Your Registry */}
                <div>
                    <Heading type="sub" text="Your Registry"/>
                    <div className="pt-2 pb-10"><Sentence text="Set up your registry and start receiving gifts from your guests."/></div>
                    <div id="the images" className="relative">
                        <div className="h-8 w-8"><img src={dashimages.towels}/></div>
                        <div className="absolute -top-8 left-8 h-28 w-28"><img src={dashimages.pans}/></div>
                        <div className="absolute -top-9 right-0 h-48 w-48"><img src={dashimages.soundbar}/></div>
                    </div>
                    <div id="the ctas" className="w-11/12 mx-auto mt-24 flex items-center justify-between">
                        <CTA type="filled" text="Manage Registry" url="/dashboard/registry"/>
                        <div className="pt-1"><CTA type="emptywitharrow" text="Add Items" url="/shop" bordercolor="peach"/></div>
                    </div>
                </div>

                <div id="spacer" className="py-8"></div>

                {/* Ideas and Advice */}
                <div>
                    <Heading type="sub" text="Ideas and Advice"/>
                    <div className="pt-2 pb-2"><Sentence text="Get expert advice on how to best plan for your special day."/></div>
                    {
                        posts.map(post=>{
                            return (
                                <Link to={`/blog/${post.slug}`}><div className="my-4 py-2 px-2 flex items-center gap-3 bg-gray-50 rounded-xl shadow-md">
                                    <div className="w-4/12"><img src={dashimages.photography} className="rounded-3xl"/></div>
                                    <div className="w-8/12">
                                        <h4 className="text-[10px] text-gray-400 font-bold uppercase">{post.category?post.category:""}</h4>
                                        <h2 className="py-1 text-gray-600 text-sm font-bold leading-tight">{post.title}</h2>
                                        <CTA type="arrownoborder" text="Read Article" url={`/blog/${post.slug}`}/>
                                    </div>
                                </div></Link>
                            )
                        })
                    }
                </div>
                {/* <div className="flex justify-end"><CTA type="empty" text="Read Articles" url={`/blog/categories/${currentuser.ceremony}`} bordercolor="peach"/></div> */}
            </div>
            <DashFooter type="main" routename={'dashboard'}/>
        </main>
    )
}
