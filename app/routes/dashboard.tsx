import { users } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import CTA from "~/components/dashboard/CTA";
import DashFooter from "~/components/dashboard/DashFooter";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import Nav from "~/components/Nav";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";
import dashimages from "~/utils/dashimages";

export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));
    
    if(session.has('userId')){
        const sessionId:string=session.get('userId');

        // now query the database for a user with the corresponding ID
        const user=await db.users.findUnique({
            where: {
                id: parseInt(sessionId)
            }
        });

        return json({
            data: {
                user: user
            }
        });
    }
    else {
        return redirect('/myaccount')
     }
}

type LoaderData={
    data: {
        user: users
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
    const loggedinstatus=loaderdata.data.user?true:false

    return (
        <main className="bg-gray-50 min-h-screen pb-72">
            <div id="holder" className="w-11/12 mx-auto">
                <div>
                    <Nav loggedin={loggedinstatus}/>
                    <div className="py-4 capitalize">
                        <Heading type="main" text={`My ${currentuser.ceremony}`}/>
                    </div>
                </div>

                {/* Add Date -- this disappears once the date has been added */}
                <div className="pt-2">
                    <Heading type="sub" text={`Have you set a date for your ${currentuser.ceremony}?`}/>
                    <div id="spacer" className="py-1"></div>
                    <div className="relative bg-pink-300 px-2 pt-2 pb-4 rounded-xl shadow-xl">
                        <div className="pb-5 px-2"><Sentence text="Start by adding the date for your function" className="text-white font-medium"/></div>
                        <div className="flex justify-end"><CTA type="filled" url="/dashboard/account" text="Add Date"/></div>
                        <div className="absolute top-8 left-6 -rotate-12"><img src={dashimages.calendar} className="h-24 w-24"/></div>
                    </div>
                </div>

                <div id="spacer" className="py-10"></div>

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
                

                {/* mobile footer */}
                <DashFooter type="main"/>
            </div>
        </main>
    )
}
