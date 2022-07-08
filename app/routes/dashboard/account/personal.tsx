import { json, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import Heading from '~/components/dashboard/Heading'
import Sentence from '~/components/dashboard/Sentence';
import FormField from '~/components/FormField';
import Label from '~/components/Label';
import Separator from '~/components/Separator';
import Spacer from '~/components/Spacer';
import { getCeremony } from '~/utils/auth.server';
import { storage } from '~/utils/session';

// SERVER
export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));

    const ceremony=await getCeremony(session);

    return json({
      data: {
        ceremony: ceremony
      }
    });
}

type LoaderData={
  data: {
    ceremony: string
  }
}
type StatusOption={
  id: string
  type: string
  name: string
  checked: boolean
}

const partnerstatusoptions:StatusOption[]=[
  {
      id: "status-bride",
      type: "Bride",
      name: "status_bride",
      checked: false
  },
  {
    id: "status-groom",
    type: "groom",
    name: "status_groom",
    checked: false
  },
  {
    id: "status-partner",
    type: "partner",
    name: "status_partner",
    checked: false
  },
];

type GuestTier={
  ranking: number
  range: string
}

const guesttiers:GuestTier[]=[
  {
    ranking: 1,
    range: "10 - 50"
  },
  {
    ranking: 2,
    range: "50 - 200"
  },
  {
    ranking: 3,
    range: "200 - 500"
  },
  {
    ranking: 4,
    range: "500 - 1000"
  },
  {
    ranking: 5,
    range: "> 1000"
  }
];



// CLIENT
export default function CeremonyDetails() {
  const loaderdata:LoaderData=useLoaderData();

  const [partnercustomstatusoptions, setPartnerCustomStatusOptions]=useState(partnerstatusoptions);

  const [showtierdrop, setTierDrop]=useState(false);
  const [selectedtier, setSelectedTier]=useState("Estimated Guests");

  // dropdown click outside
  const tierdropref=useRef<HTMLHeadingElement>(null);

  useEffect(()=>{
    function handleClickOutside(event:any){ //***fix typescript***
      if(tierdropref.current&&!tierdropref.current.contains(event.target)){
        setTierDrop(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return ()=>{
      document.removeEventListener("mousedown", handleClickOutside);
    }
  },[tierdropref]);

  return (
    <main>
        <div className='py-3'><Heading type='main' text={`Personal Information`}/></div>
        <fieldset>
          <Form method="post">
            <div id="Your Name">
              <Label for='your-name' text='Your Name'/>
              <Spacer gapsize='1'/>
              <div className='flex items-center gap-2'>
                <FormField id="your-name" type='text' name="firstname" placeholder='First Name'/>
                <FormField type='text' name="lastname" placeholder='Last Name'/>
              </div>
            </div>

            <Spacer gapsize='3'/>

            {/* The Partner */}
            <div id="Your Partner's Name">
              <Label for='your-partners-name' text="Your Partner's Name"/>
              <Spacer gapsize='1'/>
              <div className='flex items-center gap-2'>
                <FormField type='text' name="partnerfirstname" placeholder='First Name'/>
                <FormField type='text' name="partnerlastname" placeholder='Last Name'/>
              </div>
              <Spacer gapsize='1'/>
              { /* radio for status (brid/groom/partner) */}
                <div id="partner-status" className='flex items-center gap-4'>
                  {
                      partnercustomstatusoptions.map(option=>{
                        return (
                          <div className='pt-2 flex items-center gap-2'>
                            <input id={option.id} type='radio' name={option.name} checked={option.checked} className='h-5 w-5 accent-peach' onClick={()=>{
                                setPartnerCustomStatusOptions(prevstate=>{
                                  const updatedarray=prevstate.map(optionitem=>{
                                    if(optionitem.type===option.type){
                                      optionitem.checked=true;
                                    }
                                    else{
                                      optionitem.checked=false;
                                    }
                                    return optionitem;
                                  });
                                  return prevstate=updatedarray;
                                });
                            }}/>
                            <p className='text-sm text-gray-600 capitalize'>{option.type}</p>
                          </div>
                        )
                      })
                  }              
                </div>
            </div>

            <Spacer gapsize='3'/>

            {/* Ceremony Date */}
            <div id="date"><Label for="" text={`${loaderdata.data.ceremony} date`}/></div>
            <Spacer gapsize='1'/>
            <div className='flex items-center justify-between'>
              <div className='w-6/12'><FormField
              type="date"
              name="ceremony_date"
              className='text-gray-400'
              /></div>
              <Spacer gapsize='2'/>
              <div className='flex items-center gap-4'>
                <input type="checkbox" name="ceremony_check" className='h-4 w-4 accent-peach'/>
                <Sentence text='Not yet decided'/>
              </div>
            </div>

            <Spacer gapsize='3'/>

            {/* Estimated Guests */}
            <div className='relative'>
              <Label for="estimated-guests" text='Estimated Number of Guests'/>
              <Spacer gapsize='1'/>
              <button onClick={()=>{setTierDrop(prevstate=>prevstate=!prevstate)}} type='button' className='w-8/12 px-3 py-2 flex items-center justify-between border border-gray-200 rounded-xl'>
                <p className='text-gray-400 text-sm'>{selectedtier}</p>
                <div id="dropdown-icon" className=''>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
              {/* the tier dropdown */}
              {showtierdrop&&<div ref={tierdropref} className='pt-4 absolute top-20 -mt-2 bg-gray-100 rounded-xl z-10'>
                {
                   guesttiers.map(tier=>{
                    return(
                      <div className=''>
                        <button onClick={(event)=>{setSelectedTier(event.currentTarget.textContent?event.currentTarget.textContent:""); setTierDrop(false)}} type='button' className='block pl-4 pr-16 mx-4 text-sm text-gray-500'>{tier.range}</button>
                        <div className='w-10/12 mx-auto py-3'><Separator bordercolor='gray-200'/></div>
                      </div>                      
                    )
                   })
                }
              </div>}
              <div>
                <FormField
                type="hidden"
                name="guests_tier"
                placeholder='Estimated Guests'
                value={selectedtier}
                />
              </div>
            </div>

            <Spacer gapsize='3'/>

            {/* Location */}
            <div className='relative'>
              <Label for="location" text={`Where will the ${loaderdata.data.ceremony} take place?`}/>
              <Spacer gapsize='1'/>
              <FormField id="location" type="text" name="location" placeholder={loaderdata.data.ceremony.toLowerCase()==='wedding'?`Wedding Venue`:`${loaderdata.data.ceremony} Location`} className="pl-14"/>
              <div id="location pin" className='absolute top-9 left-3'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <Spacer gapsize='3'/>

          </Form>
        </fieldset>
        <Spacer gapsize='10'/>
    </main>
  )
}
