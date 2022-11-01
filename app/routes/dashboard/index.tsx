import { posts, users } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import CTA from "~/components/dashboard/CTA";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import { storage } from "~/utils/session";
import dashimages from "~/utils/dashimages";
import DashFooter from "~/components/dashboard/DashFooter";
import { getCeremony, getUser } from "~/utils/auth.server";
import Spacer from "~/components/Spacer";
import PostCard from "~/components/PostCard";
import { featuredPosts } from "~/utils/blog";
import DashboardMainSideMenu from "~/components/dashboard/DashboardMainSideMenu";


export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));

    // get user
    const theuser=await getUser(session);
    
    // get ceremony
    const ceremony=await getCeremony(session);

    // get posts by category
    const posts=await featuredPosts();

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

type BlogPostCard={
    title: string
    ceremony: string[]
    summary: string
    slug: string
    category: string
    postImage: {
        url: string
    }
  }
  
type LoaderData={
    data: {
        user: users
        posts:BlogPostCard[]
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
        url: "/vendors?category=venue"
    },
    {
        imageurl: dashimages.photography,
        categoryname: "Photography",
        url: "/vendors?category=photography"
    },
    {
        imageurl: dashimages.catering,
        categoryname: "Catering",
        url: "/vendors?category=catering"
    }
]

// info to ask user to fill in
function missingInfo(user:users, remainingDays:number){
    if(!user.ceremony_date){
        return (
            <div className="pt-2 pb-20">
                <Heading type="sub" text={`Have you set a date for your ${user.ceremony}?`}/>
                <div id="spacer" className="py-2"></div>
                <div className="relative bg-pink-300 px-2 pt-2 pb-4 rounded-xl shadow-xl lg:pt-4 lg:pb-8 lg:pr-6">
                    <div className="pb-5 px-2 lg:text-right"><Sentence text="Start by adding the date for your function" className="text-white font-medium"/></div>
                    <div className="flex justify-end"><CTA type="fillednoarrow" url="/dashboard/account/personal#date" text="Add Date"/></div>
                    <div className="absolute top-8 left-6 -rotate-12 lg:top-2"><img src={dashimages.calendar} className="h-24 w-24 lg:h-40 lg:w-40"/></div>
                </div>
                {/* <Spacer gapsize="20"/> */}
            </div>
        )
    }
    else if(!user.estimated_guests){
        return(
            <div className="pt-2">
                <Heading type="sub" text={`How many guests will be at your ${user.ceremony}?`}/>
                <div id="spacer" className="py-2"></div>
                <div className="relative bg-pink-300 px-2 pt-2 pb-4 rounded-xl shadow-xl lg:pt-4 lg:pb-8 lg:pr-6">
                    <div className="pb-6 px-2 lg:text-right"><Sentence text="Add the number of guests you expect to attend." className="text-white font-medium"/></div>
                    <div className="flex justify-end"><CTA type="fillednoarrow" url="/dashboard/account/personal#guests" text="Add Guests"/></div>
                    <div className="absolute top-8 left-6 lg:top-0"><img src={dashimages.clipboard} className="h-24 w-24 -rotate-12 lg:h-40 lg:w-40"/></div>
                </div>
                <Spacer gapsize="8"/>
            </div>
        )
    }
    else if(!user.location){
        return(
            <div className="pt-2">
                <Heading type="sub" text={`where will your ${user.ceremony} take place?`}/>
                <div id="spacer" className="py-2"></div>
                <div className="relative bg-pink-300 px-2 pt-2 pb-4 rounded-xl shadow-xl lg:pt-4 lg:pb-8 lg:pr-6">
                    <div className="pb-6 px-2 lg:text-right"><Sentence text="Add the location where the event will take place." className="text-white font-medium"/></div>
                    <div className="flex justify-end"><CTA type="fillednoarrow" url="/dashboard/account/personal#location" text="Add Location"/></div>
                    <div className="absolute top-4 left-6 lg:-top-6"><img src={dashimages.location} className="h-32 w-32 -rotate-12 lg:h-48 lg:w-48"/></div>
                </div>
                <Spacer gapsize="10"/>
            </div>
        )
    }
    else{
        return(
            <div>
                {/* Not Done: What happens when time expires */}
                <div id="spacer" className="py-2"></div>
                {remainingDays>0?<div className="relative bg-pink-300 px-2 pt-2 pb-6 rounded-xl shadow-xl lg:py-8 lg:pr-6">
                    <div className="lg:flex ">
                        <div className="lg:w-4/12"></div>
                        <div className="lg:flex lg:items-center lg:justify-between lg:w-8/12">
                        <div className="px-2 lg:w-6/12"><Sentence text="Number of Days Remaining" className="text-white font-medium"/></div>
                        <div className="w-11/12 flex items-end justify-end text-6xl text-white font-bold lg:w-6/12">
                            <p>{remainingDays>0?remainingDays:0}</p>
                            <p className="mb-2 text-xs text-white uppercase">{remainingDays===1?`day`:remainingDays<1?`days`:`days`}</p>
                        </div>
                    </div>
                    </div>
                    <div className="absolute top-9 left-6 lg:top-0"><img src={dashimages.clock} className="h-24 w-24 -rotate-12 lg:w-36 lg:h-36"/></div>
                </div>
                :                
                <div className="relative bg-pink-300 px-2 pt-2 pb-5 rounded-xl shadow-xl lg:py-12">
                    <div className="px-2"><Sentence text="It's Your Wedding Day. Yaayyyyy" className="text-white font-medium"/></div>
                    <div className="w-11/12 flex items-end justify-end text-6xl text-white font-bold">
                        <p>0</p>
                        <p className="mb-2 text-xs text-white uppercase">days</p>
                    </div>
                    <div className="absolute top-9 left-6"><img src={dashimages.dancing} className="h-24 w-24 -rotate-12 rounded-3xl"/></div>
                </div>}
                <Spacer gapsize="6"/>
            </div>
        )
    }
                
};


export default function DashboardIndex() {
    const loaderdata:LoaderData=useLoaderData();
    const currentuser=loaderdata.data.user;
    // const loggedinstatus=loaderdata.data.user?true:false
    const posts=loaderdata.data.posts;

    // days remaining
    const today=new Date();
    const ceremonydate=currentuser.ceremony_date?new Date(currentuser.ceremony_date):new Date();
    const remainingDays=Math.floor((ceremonydate.getTime()-today.getTime())/(24*60*60*1000));

    const maincontent=<div>
        <main className="bg-gray-50 min-h-screen lg:bg-white lg:py-8">
            <div id="holder-lg-right" className="w-11/12 mx-auto">
                <div className="w-11/12">
                <div>
                    <div className="py-4 capitalize">
                        <Heading type="main" text={`My ${currentuser.ceremony}`}/>
                    </div>
                </div>

                {/* Add Date / Add Number of Guests / Add Location / Days Remaining */}
                    <div className="lg:py-4">{missingInfo(currentuser, remainingDays)}</div>

                {/* Your Vendor Team */}
                    <div className="lg:py-12">
                        <Heading type="sub" text="Your vendor team"/>
                        <div className="pt-2 pb-10"><Sentence text="Discover and contact the best local experts for your special day."/></div>
                        <div>
                            <div id="holder" className="relative mt-10 pt-28 pb-6 bg-gray-100 border border-gray-200 rounded-xl shadow-xl lg:w-full">
                                <div id="cards" className="absolute -top-10 left-0 flex gap-4 lg:flex lg:gap-x-8 lg:left-4">
                                    {
                                        vendordashcards.map(dashcarditem=>{
                                            return (
                                                <Link to={dashcarditem.url} className="w-4/12">
                                                    <img src={dashcarditem.imageurl} alt={dashcarditem.categoryname} className="w-24 h-24 rounded-3xl shadow-lg lg:w-40 lg:h-40 lg:hover:scale-125 lg:hover:shadow-2xl lg:hover:mb-8"/>
                                                    <p className="mt-1 text-xs text-center text-gray-600 font-semibold lg:mt-3 lg:text-sm">{dashcarditem.categoryname}</p>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                                <div id="ctas" className="w-11/12 mx-auto flex justify-between items-center lg:pt-20 lg:w-10/12">
                                    <CTA type="empty" url="/dashboard/vendormanager" text="Manage Vendors" bordercolor="peach"/>
                                    <CTA type="fillednoarrow" url="/vendors" text="Discover Vendors"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="spacer" className="py-8"></div>

                    {/* Your Registry */}
                    <div className="lg:flex lg:items-center">
                        <div className="lg:w-5/12">
                            <div id="the images" className="hidden lg:block lg:hover:rotate-45 lg:hover:cursor-pointer">
                                <div className="h-56 w-56 p-8 bg-pink-300 rounded-full"><img src={dashimages.towels}/></div>
                            </div> 
                        </div>
                        <div className="lg:w-7/12">
                            <Heading type="sub" text="Your Registry"/>
                            <div className="pt-2 lg:pt-4 lg:pb-8"><Sentence text="Set up your registry and start receiving gifts from your guests."/></div>
                            <div id="the images" className="py-8 lg:hidden">
                                <div className="w-11/12 mx-auto h-48 w-48 p-8 bg-pink-300 rounded-full"><img src={dashimages.towels}/></div>
                            </div>
                            <div id="the ctas" className="w-11/12 mx-auto flex items-center justify-between lg:w-full">
                                <CTA type="fillednoarrow" text="Manage Registry" url={"/dashboard/registry"}/>
                                <div className="pt-1"><CTA type="emptywitharrow" text="Add Items" url="/shop" bordercolor="peach"/></div>
                            </div>
                        </div>
                    </div>

                    <div id="spacer" className="py-8"></div>

                    {/* Ideas and Advice */}
                    <div className="lg:py-8 pb-20">
                        <Heading type="sub" text="Ideas and Advice"/>
                        <div className="pt-2 pb-2"><Sentence text="Get expert advice on how to best plan for your special day."/></div>
                        
                        <div className="lg:grid lg:grid-cols-2 lg:gap-x-2">{
                            posts.map(post=>{
                                return (
                                <div className="py-4 lg:py-6"><PostCard title={post.title} ceremony={post.ceremony[0]} summary={post.summary} slug={post.slug} category={post.category?post.category.toString().toLowerCase():""} url={post.postImage.url}/></div>
                                )
                            })
                        }</div>
                    </div>
                </div>
                {/* <div className="flex justify-end"><CTA type="empty" text="Read Articles" url={`/blog/categories/${currentuser.ceremony}`} bordercolor="peach"/></div> */}
            </div>
            <div className="lg:hidden"><DashFooter type="main" routename={'dashboard'}/></div>
        </main>
    </div>


    return (
        <div>
            {/* mobile */}
            <main className="bg-gray-50 min-h-screen lg:hidden">
            <div id="holder-lg-right" className="w-11/12 mx-auto">
                <div>
                    <div className="py-4 capitalize">
                        <Heading type="main" text={`My ${currentuser.ceremony}`}/>
                    </div>
                </div>

                {/* Add Date / Add Number of Guests / Add Location / Days Remaining */}
                <div className="lg:py-4 lg:w-10/12">{missingInfo(currentuser, remainingDays)}</div>

                {/* Your Vendor Team */}
                <div className="lg:py-12">
                    <Heading type="sub" text="Your vendor team"/>
                    <div className="pt-2 pb-10"><Sentence text="Discover and contact the best local experts for your special day."/></div>
                    <div>
                        <div id="holder" className="relative mt-10 pt-28 pb-6 bg-gray-100 border border-gray-200 rounded-xl shadow-xl lg:w-10/12">
                            <div id="cards" className="absolute -top-10 left-3 flex gap-4 lg:flex lg:gap-x-8">
                                {
                                    vendordashcards.map(dashcarditem=>{
                                        return (
                                            <Link to={dashcarditem.url} className="w-4/12">
                                                <img src={dashcarditem.imageurl} alt={dashcarditem.categoryname} className="w-24 h-24 rounded-3xl shadow-lg lg:w-40 lg:h-40 lg:hover:scale-125 lg:hover:shadow-2xl lg:hover:mb-8"/>
                                                <p className="mt-1 text-xs text-center text-gray-600 font-semibold lg:mt-3 lg:text-sm">{dashcarditem.categoryname}</p>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                            <div id="ctas" className="w-11/12 mx-auto flex justify-between items-center lg:pt-20 lg:w-10/12">
                                <CTA type="empty" url="/dashboard/vendormanager" text="Manage Vendors" bordercolor="peach"/>
                                <CTA type="fillednoarrow" url="/vendors" text="Discover Vendors"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="spacer" className="py-8"></div>

                {/* Your Registry */}
                <div className="lg:w-10/12 lg:flex lg:items-center">
                    <div className="lg:w-5/12">
                        <div id="the images" className="hidden lg:block lg:hover:rotate-45 lg:hover:cursor-pointer">
                            <div className="h-56 w-56 p-8 bg-pink-300 rounded-full"><img src={dashimages.towels}/></div>
                        </div> 
                    </div>
                    <div className="lg:w-7/12">
                        <Heading type="sub" text="Your Registry"/>
                        <div className="pt-2 lg:pt-4 lg:pb-8"><Sentence text="Set up your registry and start receiving gifts from your guests."/></div>
                        <div id="the images" className="py-8 lg:hidden">
                            <div className="w-11/12 mx-auto h-48 w-48 p-8 bg-pink-300 rounded-full"><img src={dashimages.towels}/></div>
                        </div>
                        <div id="the ctas" className="w-11/12 mx-auto flex items-center justify-between lg:w-full">
                            <CTA type="fillednoarrow" text="Manage Registry" url={"/dashboard/registry"}/>
                            <div className="pt-1"><CTA type="emptywitharrow" text="Add Items" url="/shop" bordercolor="peach"/></div>
                        </div>
                    </div>
                </div>

                <div id="spacer" className="py-8"></div>

                {/* Ideas and Advice */}
                <div className="lg:py-8 pb-20 lg:w-10/12">
                    <Heading type="sub" text="Ideas and Advice"/>
                    <div className="pt-2 pb-2"><Sentence text="Get expert advice on how to best plan for your special day."/></div>
                    
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-2">{
                        posts.map(post=>{
                            return (
                            <div className="py-4 lg:py-6"><PostCard title={post.title} ceremony={post.ceremony[0]} summary={post.summary} slug={post.slug} category={post.category?post.category.toString().toLowerCase():""} url={post.postImage.url}/></div>
                            )
                        })
                    }</div>
                </div>
                {/* <div className="flex justify-end"><CTA type="empty" text="Read Articles" url={`/blog/categories/${currentuser.ceremony}`} bordercolor="peach"/></div> */}
            </div>
            <div className="lg:hidden"><DashFooter type="main" routename={'dashboard'}/></div>
        </main>

            {/* lg */}
            <div className="pt-4"><DashboardMainSideMenu maincontent={maincontent} firstname={currentuser.firstname?currentuser.firstname:""} partnerfirstname={currentuser.partnerfirstname?currentuser.partnerfirstname:""} ceremony={currentuser.ceremony?currentuser.ceremony:""} /></div>
        </div>        
    )
}

