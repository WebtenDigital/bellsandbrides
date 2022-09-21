import { ActionFunction, json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { useState } from 'react'
import CTA from '~/components/dashboard/CTA'
import Heading from '~/components/dashboard/Heading'
import Sentence from '~/components/dashboard/Sentence'
import DropDown from '~/components/DropDown'
import FormField from '~/components/FormField'
import ProgressBar from '~/components/ProgressBar'
import StepNextButton from '~/components/StepNextButton'
import { vendorCategories } from '~/utils/vendorcategories'
import bannerimages from '../utils/bannerimages'

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
  const formdata=await request.formData();
  // step one
  const businessname=formdata.get('business_name');
  const firstname=formdata.get('owner_first_name');
  const lastname=formdata.get('owner_last_name');
  const email=formdata.get('email');
  const vendorcategory=formdata.get('vendor_category');
  const phonenumber=formdata.get('phone_number');

  // step two
  const location=formdata.get('vendor_location');
  const address=formdata.get('vendor_address');
  const ighandle=formdata.get('vendor_ig_handle');
  const website=formdata.get('vendor_website');
  const fromwhere=formdata.get('from_where');
  
  return json({
    data: {

    }
  });
}

type VendorOnboardingStep={
    banner: string
    step: number
    heading: string
    stepbody: JSX.Element
}

const whereyouheardaboutus:string[]=[
  "YouTube", "Someone", "Social Media", "Google Seach"
];

const ugandalocations:string[]=[
  "Central", "West", "East", "North", "South"
];


// CLIENT
export default function VendorOnboarding() {
  const [currentstep, setCurrentStep]=useState(0);
  const [chosencategory, setChosenCategory]=useState("");
  const [chosenlocation, setChosenLocation]=useState("");

  function handleChosenValue(chosenvalue:string){
    setChosenCategory(chosenvalue);
  }  
  
  function handleChosenLocation(chosenlocation:string){
    setChosenLocation(chosenlocation);
  }

  const vendorOnboardingSteps:VendorOnboardingStep[]=[
    {
        banner: bannerimages.vendorindex,
        step: 1,
        heading: "Tell Us About You and Your Business",
        stepbody: 
        (<div>
          <Form method='post' onSubmit={()=>{handleNextClick()}}>
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
            

            <div className='py-4'>
            <div className='flex items-start gap-1'><Sentence text="Phone"/><p className='text-peach font-bold'>*</p></div>
              <p className='py-1'></p>
              <FormField type="text" name="phone_number" pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$" className='placeholder:text-gray-300 placeholder:text-sm'/>
            </div>

            <div className='flex justify-end'>
              <button type="submit"><StepNextButton arrowcolor={'white'} type="preconfigured"/></button>
            </div>
          </Form>
        </div>)
    },
    {
      banner: bannerimages.vendorindex,
      step: 2,
      heading: "Tell Us A Bit More About Your Business",
      stepbody: (<div>
        <Form method='post' onSubmit={()=>{handleNextClick()}}>
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
            <div><DropDown placeholder='Please Select an Option' options={whereyouheardaboutus} getChosenValue={(chosenvalue)=>{handleChosenValue(chosenvalue)}}/></div>
            <input type="hidden" name="from_where" value={chosencategory}/>
          </div>

          <div className='pt-10 flex justify-between'>
            <button type="button" onClick={()=>{handleBackClick()}} className="p-3 border border-gray-900 rounded-full rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>
            <button type="submit"><StepNextButton arrowcolor={'white'} type="preconfigured"/></button>                    
          </div>
        </Form>
      </div>)
    },
    {
      banner: bannerimages.vendorindex,
      step: 3,
      heading: "Thank You For Submitting",
      stepbody: <div>
        <Sentence text="Our team will review the information and reach out to you regarding the next steps."/>
        <div className='pt-8 flex justify-between items-center'>
          <button type="button" onClick={()=>{handleBackClick()}} className="p-3 border border-gray-900 rounded-full rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
          </button>
          <CTA type="fillednoarrow" text="Other Vendors" url="/vendors"/>
        </div>
      </div>
    }
];



  function handleNextClick(){
    if(currentstep<vendorOnboardingSteps.length){
      setCurrentStep(prevstate=>prevstate=prevstate+1);
    }
  }

  function handleBackClick(){
      setCurrentStep(prevstate=>prevstate=prevstate-1);
  }

  const progresspercentage=(vendorOnboardingSteps[currentstep].step/vendorOnboardingSteps.length)*100;

  return (
    <main className="">
      <div>
        <div ><img src={vendorOnboardingSteps[currentstep].banner} alt={`banner-${vendorOnboardingSteps[currentstep].step}`} className="h-64 w-full object-cover"/></div>
        <div className='py-8 relative -mt-10 bg-white rounded-t-4xl z-10'>
          <div className='w-10/12 mx-auto'>
            <div><ProgressBar progresspercentage={progresspercentage}/></div>
            <p className='py-4 text-gray-600 text-xs uppercase'>Step <span className='font-bold'>{vendorOnboardingSteps[currentstep].step}</span> Of <span className='font-bold'>{vendorOnboardingSteps.length}</span></p>
            <div className=''><Heading type="hero" text={vendorOnboardingSteps[currentstep].heading}/></div>
            <div className='my-4 border-b border-gray-200'></div>
              {/* step body here */}
              <div>
                {
                  vendorOnboardingSteps[currentstep].stepbody
                }
              </div>
          </div>
        </div>
      </div>
    </main>
  )
}
