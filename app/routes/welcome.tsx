// this page handles onboarding---more questions and data to be collected about the new user
import { vendor_categories } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import CTA from "~/components/dashboard/CTA";
import Sentence from "~/components/dashboard/Sentence";
import FormField from "~/components/FormField";
import Nav from "~/components/Nav";
import OnboardStep from "~/components/OnboardStep";
import StepBackButton from "~/components/StepBackButton";
import StepNextButton from "~/components/StepNextButton";
import { ceremonyoptions } from "~/utils/ceremonyoptions";
import dashimages from "~/utils/dashimages";
import { db} from "~/utils/db.server";
import { storage } from "~/utils/session"
import image1 from '../images/onboarding/step1.jpg'
import image2 from '../images/onboarding/step2.jpg'
import image3 from '../images/onboarding/step3.jpg'
import image4 from '../images/onboarding/wedding-cake-step-4.jpg'

//SERVER
export const action:ActionFunction=async({request})=>{
    //retrieve this user's cookie from the session that was set on redirect, and grab the stored userId value
    const session=await storage.getSession(request.headers.get("Cookie"));
    const sessisonId:string=session.get("userId");

    //get the data from the form
    const formdata=await request.formData();
    const firstname=formdata.get('first_name')?.toString();
    const lastname=formdata.get('last_name')?.toString();
    const partnerfirstname=formdata.get('partner_first_name')?.toString();
    const partnerlastname=formdata.get('partner_last_name')?.toString();
    const ceremony=formdata.get('ceremony-radio')?.toString();
    const vendorarray=formdata.getAll('vendor_checkbox');

    //add the data from the form to the user's row
    if(firstname&&lastname&&partnerfirstname&&partnerlastname){
        const updateUser=await db.users.update({
            where: {
                id: parseInt(sessisonId)
            },
            data: {
                firstname: firstname,
                lastname: lastname,
                partnerfirstname: partnerfirstname,
                partnerlastname: partnerlastname
            }
        });
    }
    else if(ceremony){
        const updateuser=await db.users.update({
            where: {
                id: parseInt(sessisonId)
            },
            data: {
                ceremony: ceremony
            }
        });
    }
    else if(vendorarray.length){
        vendorarray.map(async categoryitem=>{
            // go inside the db and fetch the ids corresponding to these selected vendor categories
            const categoryid=(await db.vendor_categories.findFirst({
                where: {
                    category: categoryitem.toString()
                }
            }))?.id;

            // now connect it to the session id in the joiner table
            const updatejoiner=await db.user_vendor_categories.create({
                data:{
                    user_id: parseInt(sessisonId),
                    vendor_category_id: categoryid
                }
            })
        });
    }

    return null;
}

export const loader:LoaderFunction=async({request})=>{
    const cookie=request.headers.get('Cookie');
    const sessionId=(await storage.getSession(cookie)).get('userId');

    if(cookie){
        const vendorcategories=await db.vendor_categories.findMany();
        const user=await db.users.findUnique(
            {
                where: {
                    id: parseInt(sessionId)
                }
            }
        )
        return json({
            data: {
                userId:user?.id,
                firstname: user?.firstname,
                ceremony: user?.ceremony,
                vendorcategories: vendorcategories
            }
        });
    }
    else{
        // if there is no cookie assigned yet, then they have no business visiting the welcome page 
        return redirect('/myaccount');    
    }    
}

type LoaderData={
    data: {
        userId: string
        firstname: string
        ceremony: string
        vendorcategories: vendor_categories[]
    }
}

//CLIENT
export default function Welcome(){
    const [currentstep, setCurrentStep]=useState(1);

    const transition=useTransition();

    const loaderdata:LoaderData=useLoaderData();
    const currentuser=loaderdata.data;
    const actiondata=useActionData();    


    // const vendors:vendor_categories[]=currentuser.vendorcategories;
    const onboardingtotalsteps=4;

    // step One
    const stepOne=(
        <div className="text-sm">
            <OnboardStep
            imageurl= {image1}
            title= "Finish setting up your new account"
            subtitle= "Tell us about yourself so we can customize your planning experience."
            step={1}   
            totalsteps={onboardingtotalsteps}
            />
            <div className="w-10/12 mx-auto">
                <Form method="post" className='pt-6' onSubmit={()=>{
                        setCurrentStep(prevstate=>prevstate+1);
                    }}>

                    <p className='pb-2'>What is your name?</p>
                    <div className="flex gap-2">
                        <FormField
                        type='text'
                        name="first_name"
                        placeholder='First Name'
                        minLength="2"
                        />

                        <FormField
                        type='text'
                        name="last_name"
                        placeholder='Last Name'
                        minLength="2"
                        />
                    </div>

                    <div className="py-3"></div>

                    <p className='pb-2'>What is your partner's name?</p>
                    <div className="flex gap-2">
                        <FormField
                        type='text'
                        name="partner_first_name"
                        placeholder='First Name'
                        minLength="2"
                        />

                        <FormField
                        type='text'
                        name="partner_last_name"
                        placeholder='Last Name'
                        minLength="2"
                        />
                    </div>

                    <div className="my-6 flex justify-end">
                        {/* disable by default and only enable if values have been entered */}
                        <button type="submit" className="p-3 bg-gray-900 rounded-full "> 
                            <StepNextButton arrowcolor="text-white"/>
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
    
    // step Two
    // create customceremonyoptions with All selected by default
    const customceremonyoptions=ceremonyoptions.map(ceremonyitem=>{
        if(ceremonyitem.toLowerCase()==='wedding'){
            return (
                {
                    ceremonyoption:ceremonyitem,
                    checkedstatus: true
                }
            )
        }
        else {
            return(
                {
                    ceremonyoption:ceremonyitem,
                    checkedstatus: false
                }
            );
        }
        
    });
    
    const [ceremonyarray, setCeremonyArray]=useState(customceremonyoptions);
    
    const stepTwo=(
        <div>
            <OnboardStep
            imageurl= {image2}
            title= "What are you planning for?"
            subtitle= "Are you currently preparing for a visitation (kukyala), an introduction (kwanjula, kuhingira) or a wedding?" 
            step={2}
            totalsteps={onboardingtotalsteps}
            />
            <div className="text-sm w-10/12 mx-auto">
                <Form method="post">
                    {
                        ceremonyarray.map(ceremonyitem=>{
                            return(
                                <div>
                                    <button className="w-full my-4 py-3 px-4 flex items-center gap-4 text-gray-600 border border-gray-100 rounded-2xl" onClick={()=>{
                                        setCeremonyArray(prevstate=>{
                                            const updatedarray=prevstate.map(previtem=>{
                                                if(previtem.ceremonyoption===ceremonyitem.ceremonyoption){
                                                    previtem.checkedstatus=true;                            
                                                }
                                                else{
                                                    previtem.checkedstatus=false;
                                                }
                                                return previtem;
                                            })
                                            return updatedarray;
                                        })
                                    }}>
                                        <input type="radio" name="ceremony-radio" value={ceremonyitem.ceremonyoption} checked={ceremonyitem.checkedstatus} className='h-5 w-5 accent-peach '/>
                                        <p className="label">{ceremonyitem.ceremonyoption}</p>
                                    </button>                                  
                                </div>
                            )
                        })
                    }
                    <div className="mt-14 mb-6 flex justify-between">
                        <StepBackButton handleClick={()=>{setCurrentStep(prevstate=>prevstate-1)}}/>
                        {/* disable by default and only enable if values have been entered */}
                        <button type="submit" className="p-3 bg-gray-900 rounded-full " onClick={()=>{
                            setCurrentStep(prevstate=>prevstate+1);
                        }}> 
                            <StepNextButton arrowcolor="text-white"/>
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );

    //step 3: which vendors
    // const [customvendoroptions, setVendorOptions]=useState(vendors.map((vendoritem)=>{
    //     switch(vendoritem.category.toLowerCase()){
    //         case "photography": case "decor": case "catering": case "venue":
    //             return({
    //                 category: vendoritem.category,
    //                 checkedstatus: true
    //             });
    //         default:
    //             return({
    //                 category: vendoritem.category,
    //                 checkedstatus: false
    //             });
    //     }
    // }));
    
    // const stepThree=(
    //     <div>
    //         <OnboardStep
    //         imageurl= {image3}
    //         title= "Which vendors will you need?"
    //         subtitle= "Choose which vendors you will need for your wedding." 
    //         step={3}  
    //         totalsteps={onboardingtotalsteps}
    //         />

    //         <div className="w-10/12 mx-auto">
    //             <Form method="post" onSubmit={()=>{
    //                         setCurrentStep(prevstate=>prevstate+1);
    //                     }}>
    //                 {
    //                     customvendoroptions.map(vendoritem=>{
    //                         return(
    //                             <button type="button" className="w-full my-4 py-3 px-4 flex items-center gap-4 text-gray-600 text-sm border border-gray-100 rounded-2xl" onClick={()=>{
    //                                 setVendorOptions(prevstate=>{
    //                                     const updatedarray=prevstate.map(previtem=>{
    //                                         if(previtem.category===vendoritem.category){
    //                                             previtem.checkedstatus=!previtem.checkedstatus;
    //                                         }
    //                                         return previtem;
    //                                     });
    //                                     return updatedarray;
    //                                 });
    //                             }}>
    //                                    <input type="checkbox" name="vendor_checkbox" checked={vendoritem.checkedstatus} value={vendoritem.category} className="accent-peach h-4 w-4 rounded-lg focus:ring-none focus:outline-none"/>
    //                                 <p>{vendoritem.category}</p>
    //                             </button>
    //                         )
    //                     })
    //                 }

    //                 <div className="mt-14 mb-6 flex justify-between">
    //                 <StepBackButton handleClick={()=>{setCurrentStep(prevstate=>prevstate-1)}}/>
                        
    //                     <button type="submit" className="p-3 bg-gray-900 rounded-full">
    //                         <StepNextButton arrowcolor="text-white"/>
    //                     </button>
    //                 </div>           
    //             </Form>            
    //         </div>
    //     </div>
    // );
    
    // step 4
    const stepFour=(
        <div>
            <OnboardStep
            imageurl= {image4}
            title= "Bells and Brides Shop"
            subtitle= "Start ticking items off your visitation, wedding and introduction list by shopping from our online store." 
            step={4}  
            totalsteps={onboardingtotalsteps}
            />
            <div className="relative w-10/12 mx-auto mt-6" >
                <div className="relative w-9/12 ml-8 px-2 text-sm bg-gray-50 shadow-xl rounded-2xl z-30 hover:cursor-pointer">
                    <div className="absolute top-2 left-4 px-2 text-xs bg-white text-peach font-bold uppercase rounded-xl">25% off</div>
                    <img src={image4} alt="online shop item" className="rounded-2xl"/>
                    <p className="py-3 text-gray-600 border-b border-gray-200 font-semibold">Strawberry Wedding Cake</p>
                    <Link to="/shop" className="flex justify-end py-3 gap-1">
                        <p>Purchase</p>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </Link>
                </div>
                <div id="behind-1" className="absolute mr-1 top-6 right-8 h-48 w-10 bg-gray-100 shadow-xl z-20 rounded-2xl"></div>
                <div id="behind-2" className="absolute mr-1 top-10 right-6 h-40 w-10 bg-gray-200 z-10 rounded-3xl"></div>
                
                <div className="mt-8 text-center">
                    <Link to="/shop" className="px-3 py-2 text-sm text-gray-600 font-semibold border border-peach rounded-lg">Visit Shop</Link>
                </div>

                <div className="mt-20 mb-6 flex justify-between">
                    <StepBackButton handleClick={()=>{setCurrentStep(prevstate=>prevstate-1)}}/>

                    <button className="flex items-center gap-3" onClick={()=>{setCurrentStep(prevstate=>prevstate+1)}}>
                        <p className="text-sm">Finish</p>
                        <div className="p-3 bg-gray-900 rounded-full"><StepNextButton arrowcolor="text-white"/></div>
                    </button>
                </div> 
            </div>
        </div>
    );

    // step 5
    const loggedstatus=currentuser.userId?true:false
    const stepFive=(
        <div className="w-11/12 mx-auto">
            <Nav loggedin={loggedstatus}/>
            <div id="holder" className="relative mt-4 py-10 shadow-xl border border-gray-100 rounded-xl">
                <div className="absolute top-3 right-3"><Link to="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg></Link>
                </div>
                <p className="text-center text-2xl text-gray-600 font-bold ">Congratulations</p>
                <div className="w-10/12 mx-auto pt-3 pb-4 text-center"><Sentence text={`Congratulations ${currentuser.firstname} on your upcoming ${currentuser.ceremony}. Now let us get you ready for the big day. 🥳`}/></div>
                <div className="flex justify-center">
                    <img src={dashimages.celebration} className="rounded-xl"/>
                </div>
                <div className="w-6/12 mx-auto pt-12"><CTA type="emptywitharrow" text="Get Started" url="/dashboard" bordercolor="peach"/></div>
            </div>
        </div>
    )
    
    const onboardFormArray:JSX.Element[]=[stepOne, stepTwo, stepFour, stepFive];

    return(
    <main className="">
        {
            onboardFormArray.map((stepitem,index)=>{
                if(currentstep===index+1){
                    return (
                        <div>
                            <div>{stepitem}</div>
                        </div>
                    );
                }
            })
        }
    </main>
    )
}