import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import DropDown from "~/components/DropDown";
import FormField from "~/components/FormField";
import ProgressBar from "~/components/ProgressBar";
import StepNextButton from "~/components/StepNextButton";
import bannerimages from "~/utils/bannerimages";
import { db } from "~/utils/db.server";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{    
    // formdata
    const formdata=await request.formData();

    // step two
    const uniqueid=formdata.get('unique_id')?.toString();
    const location=formdata.get('vendor_location')?.toString();
    const address=formdata.get('vendor_address')?.toString();
    const ighandle=formdata.get('vendor_ig_handle')?.toString();
    const website=formdata.get('vendor_website')?.toString();
    const fromwhere=formdata.get('from_where')?.toString();

    console.log("Second Half: ", uniqueid, location, address, ighandle, website, fromwhere)

    // submit to db
    if(uniqueid){
        const updatevendor=await db.vendors.update({
            where: {
                uq: uniqueid
            },
            data: {
                business_location: location,
                business_address: address,
                instagram_handle: ighandle,
                website: website,
                from_where: fromwhere,
            }
        });
    }  
    else {
        console.log("FUUUUCCCKKKKKK");
    }
    
    return redirect(`/bellsvendor/onboarding/3`);
  }

  export const loader:LoaderFunction=async({request})=>{
    // url params
    const url=new URL(request.url);
    const uniqueid=url.searchParams.get('uq');

    return json({
        data: {
            uniqueid: uniqueid?uniqueid:""
        }
    });
  }
  
  type LoaderData={
    data: {
        uniqueid: string
    }
  }


//   CLIENT
export default function StepTwo() {
    const loaderdata=useLoaderData<LoaderData>();
    const uniqueid=loaderdata.data.uniqueid;
    console.log("The ID: Hooo...", uniqueid);

    const progresspercentage=(2/3)*100;
    const [chosenlocation, setChosenLocation]=useState("");
    const [chosenwhere, setChosenWhere]=useState("Please Choose an Option");

    const whereyouheardaboutus:string[]=[
        "YouTube", "Someone", "Social Media", "Google Seach"
      ];
      
      const ugandalocations:string[]=[
        "Central", "West", "East", "North", "South"
      ];

    function handleChosenLocation(chosenlocation:string){
        setChosenLocation(chosenlocation);
    }

    function handleChosenWhere(chosenwhere:string){
        setChosenWhere(chosenwhere);
    }


  return (
    <main>
        <div>
            <div ><img src={bannerimages.vendorindex} alt={`step-two`} className="h-64 w-full object-cover"/></div>
            <div className='py-8 relative -mt-10 bg-white rounded-t-4xl z-10'>
            <div className='w-10/12 mx-auto'>
                <div><ProgressBar progresspercentage={progresspercentage}/></div>
                <p className='py-4 text-gray-600 text-xs uppercase'>Step <span className='font-bold'>2</span> Of <span className='font-bold'>3</span></p>
                <div className=''><Heading type="hero" text={`Tell Us A Bit More About Your Business`}/></div>
                <div className='my-4 border-b border-gray-200'></div>
                {/* step body here */}
                <div>
                    <Form method='post'>
                        <input type="hidden" value={uniqueid} name="unique_id"/>
                        <div>
                            <div className='flex items-start gap-1'><Sentence text="Location"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <div><DropDown placeholder='Please Select an Option' options={ugandalocations} getChosenValue={(chosenlocation)=>{handleChosenLocation(chosenlocation)}}/></div>
                            <input type="hidden" name="vendor_location" value={chosenlocation}/>
                        </div>

                        <div className='py-4'>
                        <div className='flex items-start gap-1'><Sentence text="City and Address"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="vendor_address" minLength='3'/>
                        </div>

                        <div className=''>
                            <div className='flex items-start gap-1'><Sentence text="Instagram Handle"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="vendor_ig_handle" required={false} pattern="(?:^|[^\w])(?:@)([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)"/>
                        </div>

                        <div className='py-4'>
                        <div className='flex items-start gap-1'><Sentence text="Webiste"/></div>
                            <p className='py-1'></p>
                            <FormField type="text" name="vendor_website" placeholder='www.mybusiness.com' pattern='[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)' required={false} className='placeholder:text-gray-300 placeholder:text-sm'/>
                        </div>

                        {/* where you heard about us from here */}
                        <div className='pt-2'>
                            <div className='flex items-start gap-1'><Sentence text="How Did You Know About Us?"/><p className='text-peach font-bold'>*</p></div>
                            <p className='py-1'></p>
                            <div><DropDown placeholder='Please Select an Option' options={whereyouheardaboutus} getChosenValue={(chosenwhere)=>{handleChosenWhere(chosenwhere)}}/></div>
                            <input type="hidden" name="from_where" value={chosenwhere}/>
                        </div>

                        <div className='pt-10 flex justify-between'>
                            <Link to="/bellsvendor/onboarding" className="p-3 border border-gray-900 rounded-full rotate-180">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <button type="submit"><StepNextButton arrowcolor={'white'} type="preconfigured"/></button>                    
                        </div>
                    </Form>
                </div>
            </div>
            </div>
        </div>
    </main>
  )
}
