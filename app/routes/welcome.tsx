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
import onboarding3 from '../images/others/colored-pillows.png'

//SERVER
export const action:ActionFunction=async({request})=>{
    //retrieve this user's cookie from the session that was set on redirect, and grab the stored userId value
    const session=await storage.getSession(request.headers.get("Cookie"));
    const sessisonId=session.get("userId").toString();

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
            const updatejoiner=await db.vendor_categories.create({
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
    const onboardingtotalsteps=3;

    // step One
    const stepOne=(
        <div className="text-sm lg:text-base">
            <OnboardStep
            imageurl= {image1}
            title= "Finish setting up your new account"
            subtitle= "Tell us about yourself so we can customize your planning experience."
            step={1}   
            totalsteps={onboardingtotalsteps}
            theformstuff={<div>
                            <div className="w-10/12 mx-auto lg:w-full">
                        <Form method="post" className='pt-6' onSubmit={()=>{
                                setCurrentStep(prevstate=>prevstate+1);
                            }}>

                            <p className='pb-2 lg:pb-4'>What is your name?</p>
                            <div className="flex gap-2 lg:flex lg:justify-between lg:gap-4">
                                <div className="w-full"><FormField
                                type='text'
                                name="first_name"
                                placeholder='First Name'
                                minLength="2"
                                /></div>

                                <div className="w-full"><FormField
                                type='text'
                                name="last_name"
                                placeholder='Last Name'
                                minLength="2"
                                /></div>
                            </div>

                            <div className="py-3"></div>

                            <p className='pb-2 lg:pb-4'>What is your partner's name?</p>
                            <div className="flex gap-2 lg:flex lg:justify-between lg:gap-x-4">
                                <div className="w-full"><FormField
                                type='text'
                                name="partner_first_name"
                                placeholder='First Name'
                                minLength="2"
                                /></div>

                                <div className="w-full"><FormField
                                type='text'
                                name="partner_last_name"
                                placeholder='Last Name'
                                minLength="2"
                                /></div>
                            </div>

                            <div className="my-6 flex justify-end">
                                {/* disable by default and only enable if values have been entered */}
                                <button type="submit" className="p-3 bg-gray-900 rounded-full "> 
                                    <StepNextButton arrowcolor="text-white"/>
                                </button>
                            </div>
                        </Form>
                    </div>
            </div>}
            />

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
            theformstuff={
                <div>
                    <div className="text-sm w-10/12 mx-auto lg:w-full">
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
                            <div className="mt-14 mb-6 flex justify-between lg:mt-8">
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
            }
            />
        </div>
    );
    
    // step 3
    const stepThree=(
        <div>
            <OnboardStep
            imageurl= {image4}
            title= "Bells and Brides Registry"
            subtitle= "Visit our registry store to choose from our carefully curated sets of items and experiences that you would like to have as your wedding gifts. Then let your people decide on what to gift you based on those options." 
            step={3}  
            totalsteps={onboardingtotalsteps}
            theformstuff={
                <div className="w-10/12 mx-auto lg:w-full">
                    <div className="lg:hidden py-8">
                        <div className="relative" >
                            <div className="relative w-10/12 mx-auto px-2 py-4 text-sm bg-gray-50 shadow-xl rounded-3xl z-30 hover:cursor-pointer">
                                <div className="w-10/12 mx-auto py-4"><img src={onboarding3} alt="online shop item" className="rounded-2xl"/></div>
                                <p className="py-3 text-gray-600 text-center font-semibold">Bedroom Collections</p>
                                <div className="flex justify-center py-2"><CTA type="fillednoarrow" text="Visit Shop" url="/shop"/></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-8 flex justify-between">
                        <StepBackButton handleClick={()=>{setCurrentStep(prevstate=>prevstate-1)}}/>

                        <button className="flex items-center gap-3" onClick={()=>{setCurrentStep(prevstate=>prevstate+1)}}>
                            <p className="text-sm lg:text-base">Finish</p>
                            <div className="p-3 bg-gray-900 rounded-full"><StepNextButton arrowcolor="text-white"/></div>
                        </button>
                    </div> 
                </div>
            }
            step3stuff={
                <div>
                    <div className="relative w-10/12 mx-auto" >
                        <div className="relative w-6/12 mx-auto px-2 py-4 text-sm bg-gray-50 shadow-xl rounded-2xl z-30 hover:cursor-pointer lg:text-base lg:rounded-4xl">
                            <div className="w-10/12 mx-auto py-4"><img src={onboarding3} alt="online shop item" className="rounded-2xl"/></div>
                            <p className="py-3 text-gray-600 text-center font-semibold">Bedroom Collections</p>
                            <div className="flex justify-center py-2"><CTA type="fillednoarrow" text="Purchase" url="/shop"/></div>
                        </div>
                        <div id="behind-1" className="absolute mr-2 top-6 right-28 h-56 w-10 bg-gray-100 shadow-xl z-20 rounded-2xl"></div>
                        <div id="behind-2" className="absolute mr-3 top-12 right-24 h-48 w-10 bg-gray-200 z-10 rounded-3xl"></div>
                        
                    </div>
                </div>
            }
            />
        </div>
    );

    // step 5
    const loggedstatus=currentuser.userId?true:false
    const stepFive=(
        <div className="w-11/12 mx-auto">
            <Nav loggedin={loggedstatus}/>
            <div id="holder" className="relative mt-4 py-10 shadow-xl border border-gray-100 rounded-xl lg:w-7/12 lg:mx-auto">
                <div className="absolute top-3 right-3"><Link to="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg></Link>
                </div>
                <p className="text-center text-2xl text-gray-600 font-bold ">Congratulations</p>
                <div className="lg:hidden w-10/12 mx-auto pt-3 pb-4 text-center"><Sentence text={`Congratulations ${currentuser.firstname} on your upcoming ${currentuser.ceremony}. Now let us get you ready for the big day. 🥳`}/></div>
                <div className="hidden lg:block w-10/12 mx-auto py-4 text-center"><Sentence text={`Congratulations ${currentuser.firstname} on your upcoming ${currentuser.ceremony}.`}/></div>
                <div className="hidden lg:block w-10/12 mx-auto pb-8 text-center"><Sentence text={`Now let us get you ready for the big day. 🥳`}/></div>
                <div className="flex justify-center">
                    <img src={dashimages.celebration} className="rounded-xl"/>
                </div>
                <div className="w-6/12 mx-auto pt-12 lg:w-5/12"><CTA type="emptywitharrow" text="Get Started" url="/dashboard" bordercolor="peach"/></div>
            </div>
        </div>
    )
    
    const onboardFormArray:JSX.Element[]=[stepOne, stepTwo, stepThree, stepFive];

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