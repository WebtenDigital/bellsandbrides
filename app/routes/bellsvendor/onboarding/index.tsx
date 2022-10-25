import { ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid'
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import DropDown from "~/components/DropDown";
import FormField from "~/components/FormField";
import ProgressBar from "~/components/ProgressBar";
import StepNextButton from "~/components/StepNextButton";
import bannerimages from "~/utils/bannerimages";
import { db } from "~/utils/db.server";
import { vendorCategories } from "~/utils/vendorcategories";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const formdata=await request.formData();
    // step one
    const businessname=formdata.get('business_name')?.toString();
    const slug=slugify(businessname?businessname.toLowerCase():"");
    const firstname=formdata.get('owner_first_name')?.toString();
    const lastname=formdata.get('owner_last_name')?.toString();
    const email=formdata.get('email')?.toString();
    const vendorcategory=formdata.get('vendor_category')?.toString();
    const phonenumber=formdata.get('phone_number')?.toString();
    const uniqueid=formdata.get('unique_id')?.toString();
  
    // add to db
    const addvendortodb=await db.vendors.create({
      data: {
        uq: uniqueid,
        vendor_name: businessname,
        owner_firstname: firstname,
        owner_lastname: lastname,
        vendor_email: email,
        category: vendorcategory,
        vendor_phone_number: phonenumber,
        slug: slug,      
      }
    });
  
    console.log("First Half: ", uniqueid, businessname, firstname,lastname, email, vendorcategory, phonenumber, slug);  
    
    return redirect(`/bellsvendor/onboarding/2?uq=${uniqueid}`);
  }
  

// CLIENT
export default function StepOne() {
    const progresspercentage=(1/3)*100;

    const [chosencategory, setChosenCategory]=useState("");

    function handleChosenValue(chosenvalue:string){
        setChosenCategory(chosenvalue);
      } 

  return (
    <main>
        <div>
            <div ><img src={bannerimages.vendorindex} alt={`step-one`} className="h-64 w-full object-cover"/></div>
            <div className='py-8 relative -mt-10 bg-white rounded-t-4xl z-10'>
            <div className='w-10/12 mx-auto'>
                <div><ProgressBar progresspercentage={progresspercentage}/></div>
                <p className='py-4 text-gray-600 text-xs uppercase'>Step <span className='font-bold'>1</span> Of <span className='font-bold'>3</span></p>
                <div className=''><Heading type="hero" text={`Tell Us About You and Your Business`}/></div>
                <div className='my-4 border-b border-gray-200'></div>
                {/* step body here */}
                <div>
                    <div>
                        <Form method='post'>
                            <div className=''>
                            <div className='flex items-start gap-1'><Sentence text="Business Name"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="business_name" minLength='3'/>
                            </div>

                            <div className='py-4'>
                            <div className='flex items-start gap-1'><Sentence text="First Name"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="owner_first_name" minLength='3'/>
                            </div>

                            <div className=''>
                            <div className='flex items-start gap-1'><Sentence text="Last Name"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="owner_last_name" minLength='3'/>
                            </div>

                            <div className='py-4'>
                            <div className='flex items-start gap-1'><Sentence text="Email"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="email" name="email" placeholder='Email' className='placeholder:text-gray-300 placeholder:text-sm'/>
                            </div>

                            {/* category here */}
                            <div>
                            <div className='flex items-start gap-1'><Sentence text="Vendor Type"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <div><DropDown placeholder='Please Select an Option' options={vendorCategories} getChosenValue={(chosenvalue)=>{handleChosenValue(chosenvalue)}}/></div>
                            <input type="hidden" required name="vendor_category" value={chosencategory}/>
                            </div>

                            {/* uuid */}
                            <input type="hidden" value={uuidv4()} name="unique_id"/>
                            

                            <div className='py-4'>
                            <div className='flex items-start gap-1'><Sentence text="Phone"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="phone_number" pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$" className='placeholder:text-gray-300 placeholder:text-sm'/>
                            </div>

                            <div className='flex justify-end'>
                            <button type="submit"><StepNextButton arrowcolor={'white'} type="preconfigured"/></button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </main>
  )
}
