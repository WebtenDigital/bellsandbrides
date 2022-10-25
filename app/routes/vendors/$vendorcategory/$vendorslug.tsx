import { user_vendor_reviews, vendors } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import DateMathematics from "~/components/DateMathematics";
import FormField from "~/components/FormField";
import RatingStars from "~/components/RatingStars";
import SuperSpinner from "~/components/SuperSpinner";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));
    const userid=parseInt(session.get("userId")?.toString());

    const user=await db.users.findFirst({
        where: {
            id: userid
        }
    });

    const formdata=await request.formData();
    const rating=formdata.get("rating")?.toString();
    const review=formdata.get("review")?.toString();
    const hired=formdata.get("hired")?.toString();
    const vendorid=formdata.get("vendor_id")?.toString();
    const likedstatus=formdata.get("liked_status")?.toString();
    const vendoridheart=formdata.get("vendor_id_heart")?.toString();
    const vendorcategory=formdata.get("vendor_category")?.toString();

    // like the vendor - add to the user_vendor table
    if(likedstatus?.toLowerCase()==="liked"){
        const addtouservendors=await db.user_vendors.create({
            data: {
                user_id: userid,
                vendor_id: parseInt(vendoridheart?vendoridheart:""),
                vendor_category: vendorcategory
            }
        });
    }
    else if(likedstatus?.toLowerCase()==='unliked'){
        const removefromuservendors=await db.user_vendors.deleteMany({
            where: {
                user_id: userid,
                vendor_id: parseInt(vendoridheart?vendoridheart:"")
            }
        })
    }

    // first make sure this user has not submitted a review before
    const checkforpreviousreview=await db.user_vendor_reviews.findFirst({
        where: {
            user_id: userid
        }
    });

    // now, we submit to database
    if(!checkforpreviousreview){
        if(rating&&review){
            const addratingandreviewtodb=await db.user_vendor_reviews.create({
                data: {
                    user_id: userid,
                    vendor_id: parseInt(vendorid?vendorid:""),
                    rating: parseInt(rating?rating:""),
                    review: review,
                    user_first_name: user?.firstname,
                    user_last_name: user?.lastname,
                    review_date: new Date()
                }
            });
        }
        else if(!rating&&review){
            const addreviewtodb=await db.user_vendor_reviews.create({
                data: {
                    user_id: userid,
                    vendor_id: parseInt(vendorid?vendorid:""),
                    rating: 1,
                    review: review,
                    user_first_name: user?.firstname,
                    user_last_name: user?.lastname,
                    review_date: new Date()
                }
            });
        }
    }

    return null;
}

// Loader
export const loader:LoaderFunction=async({request, params})=>{
    const session=await storage.getSession(request.headers.get("Cookie"));
    const userid=parseInt(session.get("userId")?.toString());

    const loggedin=userid?true:false;

    const reviewedalready=userid&&(await db.user_vendor_reviews.findFirst({
        where: {
            user_id: userid
        }
    }))?true:false;

    const slug=params.vendorslug;
    
    const thevendor=await db.vendors.findFirst({
        where: {
            slug: slug
        }
    });

    // get the reviews themselves
    const reviews=(await db.user_vendor_reviews.findMany({
        where: {
            vendor_id: thevendor?.id,
            // review_status: 1            
        }
    }));

    // get user's likedstatus for this vendor
    const likedstatus=userid&&(await db.user_vendors.findFirst({
        where: {
            user_id: userid,
            vendor_id: thevendor?.id
        }
    }))?true:false;


    return json({
        data: {
            thevendor: thevendor,
            reviews: reviews,
            loggedin: loggedin,
            reviewedalready: reviewedalready,
            likedstatus: likedstatus
        }
    });
}

type LoaderData={
    data: {
        thevendor: vendors,
        reviews: user_vendor_reviews[],
        loggedin: boolean,
        reviewedalready: boolean,
        likedstatus: boolean
    }
}



// CLIENT
export default function DynamicVendor() {
    const loaderdata=useLoaderData<LoaderData>();
    const vendor=loaderdata.data.thevendor;
    const loggedin=loaderdata.data.loggedin;
    const reviews=loaderdata.data.reviews;
    const reviewedalready=loaderdata.data.reviewedalready;
    const liked=loaderdata.data.likedstatus;

    const vendorimages=[vendor.cover_image, vendor.image_one, vendor.image_two, vendor.image_three, vendor.image_four, vendor.image_five].filter(image=>image?.length);

    const [stopindex, setStopIndex]=useState(1);

    const [showwritereview, setShowWriteReview]=useState(false);

    const [likedstatus, setLikedStatus]=useState(liked);

    function handleClick(){
        if(stopindex<=vendorimages.length-1){
            setStopIndex(prevstate=>prevstate=prevstate+1);
        }
        else setStopIndex(1);
    }

    function setHeart(likedstatus:boolean){
        if(likedstatus){
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-peach" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
          )
        }  
        else{
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )
        }  
    }

    // stars
    const [rating, setRating]=useState(0);

    const transition=useTransition();

  return (
    <main className="relative">
        {
            showwritereview?
            <div className="my-4 py-4 bg-gray-50">
                <div className="w-11/12 mx-auto">
                    <div className="flex items-center justify-between">
                        <div><Heading type="mid" text="Write a Review"/></div>
                        <button onClick={()=>{setShowWriteReview(false)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-9 h-9 text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="my-6 border-b border-gray-200"></div>

                    <div><Heading type="mid" text={vendor.vendor_name?vendor.vendor_name:""}/></div>

                    <div className="py-4"><Sentence text="Share your honest rating and opinion."/></div>

                    <div className="flex items-center">{
                        [...Array(5)].map((star, index)=>{
                            return (
                                <button onClick={()=>{setRating(index+1)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={rating>index?"w-6 h-6 text-peach":"w-6 h-6 text-gray-200"}>
                                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            )
                        })
                    }</div>

                    <div className="my-6 border-b border-gray-200"></div>

                    <Form method="post" onSubmit={()=>{setShowWriteReview(false)}}>
                        <div id="about" className="py-4">
                            <div className="pb-2"><Heading type="sub" text="Your Review"/></div>
                            <input type="hidden" value={rating} name="rating"/>
                            <input type="hidden" value={vendor.id} name="vendor_id"/>
                            <textarea rows={8} name="review" className="w-full px-2 py-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-300 placeholder:text-sm placeholder:text-justify focus:outline-none" required={false} placeholder="Share what informed your rating. You can comment on important vendor qualities such as professionalism, punctuality and quality of service."/>
                        </div>

                        <div><Sentence text="Did you hire this vendor?"/></div>
                        <div className="flex items-center gap-x-8">{
                            ["Yes", "No"].map(option=>{
                                return (
                                    <div>
                                        <div className="flex items-center gap-x-2">
                                            <div className="py-2"><FormField type="radio" name="hired" value={option} className="h-5 w-5 accent-peach"/></div>
                                            <Sentence text={option}/>
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
                        <div className="py-4 italic"><Sentence text="You will be requested to share proof of transaction in order to verify this review."/></div>
                        
                        <div className="pt-4 w-8/12"><button type="submit" className="w-full py-2 text-center bg-peach text-white text-sm font-bold rounded-xl">{transition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="peach"/>Submitting...</div>:"Submit Review"}</button></div>
                    </Form>
                </div>
            </div>
            :
            <div id="HOLDER">
            {/* <div className="absolute top-0 h-60 w-full bg-gray-50"><Outlet/></div> */}
            <div className="bg-gray-50 p-2">
                {/* <div className=""><img src={vendor.cover_image?vendor.cover_image:""} alt={`${vendor.vendor_name}'s cover`} className="h-48 w-full object-cover rounded-xl"/></div> */}
                <div className="">
                    {
                        vendorimages.slice(stopindex-1, stopindex).map(image=>{
                            return (
                                <div className="relative">
                                    {
                                        image&&<div className="w-full"><img src={image} className="h-60 w-full object-cover rounded-xl"/></div>
                                    }
                                    <div className="absolute top-24 right-2">
                                        <button className="p-1 bg-white opacity-80 shadow-xl rounded-lg focus:outline-none" onClick={()=>{handleClick()}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {/* <div className="pt-1 flex justify-end"><div className="text-peach text-sm font-semibold border-b border-peach"><Link to={`/vendors/${vendor.category?.toLowerCase()}/${vendor.slug}/gallery`}>See All</Link></div></div> */}
            </div>
    
            <div className="w-11/12 mx-auto">
                <div className="pt-8">
                    <Heading type="main" text={vendor.vendor_name?vendor.vendor_name:""}/>
                </div>
    
                <div>
                    <div className="pt-4 flex items-center gap-x-4">
                        <div id="pin">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-gray-500" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>
                        </div>
                        <div><Sentence text={vendor.business_address?vendor.business_address:"Uganda"}/></div>
                    </div>
                    {/* <div className="my-4"></div> */}
                    <div className="pt-3 flex items-center gap-x-4">
                        <div id="like">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-gray-500" viewBox="0 0 24 24"><path d="M5 22h-5v-12h5v12zm17.615-8.412c-.857-.115-.578-.734.031-.922.521-.16 1.354-.5 1.354-1.51 0-.672-.5-1.562-2.271-1.49-1.228.05-3.666-.198-4.979-.885.906-3.656.688-8.781-1.688-8.781-1.594 0-1.896 1.807-2.375 3.469-1.221 4.242-3.312 6.017-5.687 6.885v10.878c4.382.701 6.345 2.768 10.505 2.768 3.198 0 4.852-1.735 4.852-2.666 0-.335-.272-.573-.96-.626-.811-.062-.734-.812.031-.953 1.268-.234 1.826-.914 1.826-1.543 0-.529-.396-1.022-1.098-1.181-.837-.189-.664-.757.031-.812 1.133-.09 1.688-.764 1.688-1.41 0-.565-.424-1.109-1.26-1.221z"/></svg>                    </div>
                        <div><Sentence text={`${reviews.length} reviews and recommendations`}/></div>
                    </div>
    
                    <div className="pt-8 flex items-center gap-x-3">
                        <div id="facebook">
                            <a href={vendor.facebook_link?vendor.facebook_link:"#"} target="_blank" rel="non-referrer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-gray-500" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>
                            </a>
                        </div>
                        <div id="instagram">
                            <a href={vendor.instagram_link?vendor.instagram_link:"#"} target="_blank" rel="non-referrer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-gray-500" viewBox="0 0 24 24"><path d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z"/></svg>
                            </a>
                        </div>
                        <div id="web">
                            <a href={vendor.website?vendor.website:"#"} target="_blank" rel="non-referrer">
                                <svg className="w-6 h-6 fill-gray-500" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M15.246 17c-.927 3.701-2.547 6-3.246 7-.699-1-2.32-3.298-3.246-7h6.492zm7.664 0c-1.558 3.391-4.65 5.933-8.386 6.733 1.315-2.068 2.242-4.362 2.777-6.733h5.609zm-21.82 0h5.609c.539 2.386 1.47 4.678 2.777 6.733-3.736-.8-6.828-3.342-8.386-6.733zm14.55-2h-7.28c-.29-1.985-.29-4.014 0-6h7.281c.288 1.986.288 4.015-.001 6zm-9.299 0h-5.962c-.248-.958-.379-1.964-.379-3s.131-2.041.379-3h5.962c-.263 1.988-.263 4.012 0 6zm17.28 0h-5.963c.265-1.988.265-4.012.001-6h5.962c.247.959.379 1.964.379 3s-.132 2.042-.379 3zm-8.375-8h-6.492c.925-3.702 2.546-6 3.246-7 1.194 1.708 2.444 3.799 3.246 7zm-8.548-.001h-5.609c1.559-3.39 4.651-5.932 8.387-6.733-1.237 1.94-2.214 4.237-2.778 6.733zm16.212 0h-5.609c-.557-2.462-1.513-4.75-2.778-6.733 3.736.801 6.829 3.343 8.387 6.733z"/></svg>
                            </a>
                        </div>
                    </div>
    
                    <div className="my-8 border-b border-gray-200"></div>
    
                    <div>
                        <div><Heading type="mid" text="About"/></div>
                        <div className="py-2 text-justify"><Sentence text={vendor.about?vendor.about:""}/></div>
                    </div>
    
                    <div className="pt-8 pb-4">
                        <div><Heading type="mid" text={`Reviews and Recommendation ${reviews.length?`(${reviews.length})`:""}`}/></div>
                        <div className="py-2">
                            {
                                !reviews.length?
                                (loggedin?
                                <div>
                                    <div className="py-2"><Sentence text="No reviews yet. Be the first to share your thoughts with other couples."/></div>
                                    <div className="py-2"><button className="py-2 px-4 text-sm text-peach font-medium border border-peach rounded-lg" onClick={()=>{setShowWriteReview(true)}}>Write a Review</button></div>
                                    <div className="my-4 border-b border-gray-200"></div>
                                </div>
                                :
                                <div><Sentence text="No reviews yet."/></div>
                                )
                                :
                                <div id="the reviews">
                                    {
                                        loggedin&&!reviewedalready&&<div className="py-2"><button className="py-2 px-4 text-sm text-peach font-medium border border-peach rounded-lg" onClick={()=>{setShowWriteReview(true)}}>Write a Review</button></div>

                                    }
                                    <div className="">{
                                        reviews.map(review=>{
                                            return (
                                                <div className="py-5 border-b border-gray-200">
                                                    <div className="pb-2 flex items-center justify-between">
                                                        <p className="text-sm text-gray-400 font-bold">{`${review.user_first_name} ${review.user_last_name}`}</p>
                                                        <div><RatingStars rating={review.rating?review.rating:0}/></div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="py-2 flex items-center gap-3">
                                                            <div><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-green-500" viewBox="0 0 24 24"><path d="M5.48 10.089l1.583-1.464c1.854.896 3.028 1.578 5.11 3.063 3.916-4.442 6.503-6.696 11.311-9.688l.516 1.186c-3.965 3.46-6.87 7.314-11.051 14.814-2.579-3.038-4.301-4.974-7.469-7.911zm14.407.557c.067.443.113.893.113 1.354 0 4.962-4.038 9-9 9s-9-4.038-9-9 4.038-9 9-9c1.971 0 3.79.644 5.274 1.723.521-.446 1.052-.881 1.6-1.303-1.884-1.511-4.271-2.42-6.874-2.42-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11c0-1.179-.19-2.313-.534-3.378-.528.633-1.052 1.305-1.579 2.024z"/></svg></div>
                                                            <Sentence text="Verified Review"/>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <div><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-gray-600" viewBox="0 0 24 24"><path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z"/></svg></div>
                                                                
                                                                <div className="flex items-end gap-1">
                                                                    <DateMathematics thedate={review.review_date?review.review_date:new Date("15 August 1995")}/>
                                                                    <Sentence text="ago"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="py-2 text-justify"><Sentence text={review.review?review.review:""}/></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="pb-4 flex items-center justify-between">
                    <div className="w-8/12 "><button className="w-full px-4 py-2 text-white text-sm bg-peach rounded-lg">Contact Vendor</button></div>
                    <div>
                        <Form method="post">
                            <input type="hidden" name="liked_status" value={likedstatus?"liked":"unliked"}/>
                            <input type="hidden" name="vendor_id_heart" value={vendor.id}/>
                            <input type="hidden" name="vendor_category" value={vendor.category?vendor.category:""}/>
                            {
                                loggedin?
                                <button type="submit" onClick={()=>{setLikedStatus(prevstate=>prevstate=!prevstate)}}>
                                {
                                setHeart(likedstatus)
                                }
                                </button>
                                :
                                <div is="set-heart">
                                    <Link to={`/myaccount?from=vendors/${vendor.category?.toLowerCase()}/${vendor.slug}#set-heart`}>
                                        {
                                            setHeart(false)
                                        }
                                    </Link>
                                </div>
                            }
                        </Form>
                    </div>
                </div>
            </div>
            </div>   
        }
    </main>
  )
}
