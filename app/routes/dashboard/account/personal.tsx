import { users } from '@prisma/client';
import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import Heading from '~/components/dashboard/Heading'
import Sentence from '~/components/dashboard/Sentence';
import FormField from '~/components/FormField';
import Label from '~/components/Label';
import ProgressBar from '~/components/ProgressBar';
import Separator from '~/components/Separator';
import Spacer from '~/components/Spacer';
import Submit from '~/components/Submit';
import { db } from '~/utils/db.server';
import { storage } from '~/utils/session';

// SERVER
// Action
export const action:ActionFunction=async ({request})=>{
  // grab the current session
  const session=await storage.getSession(request.headers.get('Cookie'));
  const sessionId=session.has('userId')?session.get('userId'):"";

  // get the user's already existing values
  const user=await db.users.findUnique({
    where: {
      id: parseInt(sessionId)
    }
  });

  // get the form data
  const formdata=await request.formData();

  // grab the data from individual inputs by their "names"
  // if there is a new value put, update the table, otherwise, use the already existing value
  const firstname=formdata.get('firstname')?.toString()?formdata.get('firstname'):user?.firstname;
  const lastname=formdata.get('lastname')?formdata.get('lastname'):user?.lastname;
  const partnerfirstname=formdata.get('partnerfirstname')?formdata.get('partnerfirstname'):user?.partnerfirstname;
  const partnerlastname=formdata.get('partnerlastname')?formdata.get('partnerlastname'):user?.partnerlastname;
  const partnerstatus=formdata.get('partner_status')?formdata.get('partner_status'):user?.partner_status
  const userstatus=partnerstatus?.toString().toLowerCase()==='bride'?"groom":partnerstatus?.toString().toLowerCase()==='groom'?"bride":partnerstatus?.toString()==="partner"?"partner":user?.user_status;
  const dateconfirmed=formdata.get('date_confirmed');
  const date=formdata.get('ceremony_date')?formdata.get('ceremony_date'):user?.ceremony_date;
  const ceremonydate=dateconfirmed?null:new Date(date?.toString()?date.toString():"");
  const gueststier=formdata.get('guests_tier')?formdata.get('guests_tier'):user?.estimated_guests;
  const location=formdata.get('location')?formdata.get('location'):user?.location;
  
  // update the db as needed
  const updateUser=await db.users.update({
    where: {
      id: parseInt(sessionId)
    },
    data: {
      firstname: firstname?.toString(),
      lastname: lastname?.toString(),
      partnerfirstname: partnerfirstname?.toString(),  
      partnerlastname: partnerlastname?.toString(),     
      ceremony_date:ceremonydate, //*this should produce an error - the sql table needs a DATE format
      user_status: userstatus,   
      partner_status: partnerstatus?.toString(),     
      location:location?.toString(),             
      estimated_guests: gueststier?.toString(),  
    }
  });


  // return action data
  return json({
    data: {

    }
  });
}

// Loader
export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));
    const sessionId=parseInt(session.get('userId'));

    // query database for the already existing values -- we shall place these in the form's value field, and only replaced when a new value is added
    const user=await db.users.findUnique({
      where: {
        id: sessionId
      }
    });

      // user data array
  let availableuserdetails=[];
  if(user?.firstname&&user.lastname){availableuserdetails.push(user.firstname)};
  if(user?.partnerfirstname&&user.partnerlastname){availableuserdetails.push(user.partnerfirstname)};
  if(user?.ceremony){availableuserdetails.push(user.ceremony)};
  if(user?.ceremony_date){availableuserdetails.push(user.ceremony_date)};
  if(user?.estimated_guests){availableuserdetails.push(user.estimated_guests)};
  if(user?.location){availableuserdetails.push(user.location)};


    // const ceremony=await getCeremony(session);
    return json({
      data: {
        user: user,
        availabledetails:availableuserdetails.length
      }
    });
}

type LoaderData={
  data: {
    user: users,
    availabledetails: number
  }
}

type ActionData={
  data: {

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
export default function CeremonyDetails(){
  const loaderdata:LoaderData=useLoaderData();
  const user=loaderdata.data.user;
  const actiondata=useActionData<ActionData>();

  // user's columns
  const detailsavailable=loaderdata.data.availabledetails;
  const totaldetails=6;
  const availablepercentage=Math.floor(detailsavailable/totaldetails*100);

  const [partnercustomstatusoptions, setPartnerCustomStatusOptions]=useState(partnerstatusoptions);

  const [showtierdrop, setTierDrop]=useState(false);
  const [selectedtier, setSelectedTier]=useState("");
  const [placeholder, setPlaceHolder]=useState(user.estimated_guests?user.estimated_guests:"Estimated Guests");

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

  // location placeholder
  const locationplaceholder=user.ceremony?.toLowerCase()==='wedding'?`Wedding Venue`:`${user.ceremony} Location`;

  // transition
  const transition=useTransition();

  return (
    <main className='lg:w-7/12'>
        <div className='py-3'><Heading type='main' text={`Personal Information`}/></div>
        {/* progress bar */}
        <div className='lg:py-4'>
          <Sentence text={`${availablepercentage}% Complete`}/>
          <ProgressBar progresspercentage={availablepercentage}/>
        </div>
        <Spacer gapsize='2'/>
        <fieldset>
          <Form method="post" noValidate>
            {/* User's Name */}
            <div id="Your Name" className='lg:py-4'>
              <Label for='your-name' text='Your Name'/>
              <Spacer gapsize='1'/>
              <div className='flex items-center gap-2 lg:w-full'>
                <FormField id="your-name" type='text' name="firstname" placeholder={user.firstname?user.firstname:"First Name"}/>
                <FormField type='text' name="lastname" placeholder={user.lastname?user.lastname:'Last Name'}/>
              </div>
            </div>

            <Spacer gapsize='3'/>

            {/* The Partner */}
            <div id="Your Partner's Name">
              <Label for='your-partners-name' text="Your Partner's Name"/>
              <Spacer gapsize='1'/>
              <div className='flex items-center gap-2'>
                <FormField type='text' name="partnerfirstname" placeholder={user.partnerfirstname?user.partnerfirstname:'First Name'}/>
                <FormField type='text' name="partnerlastname" placeholder={user.partnerlastname?user.partnerlastname:'Last Name'}/>
              </div>
              <Spacer gapsize='1'/>
              { /* radio for status (brid/groom/partner) */}
                <div id="partner-status" className='flex items-center gap-4'>
                  {
                      partnercustomstatusoptions.map(option=>{
                        return (
                          <div className='pt-2 flex items-center gap-2'>
                            <input id={option.id} type='radio' name="partner_status" value={option.type} checked={option.checked} className='h-5 w-5 accent-peach' onClick={()=>{
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
            <div id="date" className='lg:py-4'><Label for="" text={`${loaderdata.data.user.ceremony} date`}/></div>
            <Spacer gapsize='1'/>
            <div className='flex items-center justify-between'>
              <div className='w-6/12'><FormField
              type="date"
              name="ceremony_date"
              className='text-gray-400'
              /></div>
              <Spacer gapsize='2'/>
              <div className='flex items-center gap-4'>
                <input type="checkbox" name="date_confirmed" className='h-4 w-4 accent-peach'/>
                <Sentence text='Not yet decided'/>
              </div>
            </div>

            <Spacer gapsize='3'/>

            {/* Estimated Guests */}
            <div id="guests" className='relative lg:py-4'>
              <Label for="estimated-guests" text='Estimated Number of Guests'/>
              <Spacer gapsize='1'/>
              <button onClick={()=>{setTierDrop(prevstate=>prevstate=!prevstate)}} type='button' className='w-8/12 px-3 py-2 flex items-center justify-between border border-gray-200 rounded-xl'>
                <p className='text-gray-400 text-sm'>{placeholder}</p>
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
                        <button onClick={(event)=>{setSelectedTier(event.currentTarget.textContent?event.currentTarget.textContent:""); setPlaceHolder(event.currentTarget.textContent?event.currentTarget.textContent:""); setTierDrop(false)}} type='button' className='block pl-4 pr-16 mx-4 text-sm text-gray-500'>{tier.range}</button>
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
            <div id="location" className='relative'>
              <Label for="location" text={`Where will the ${loaderdata.data.user.ceremony} take place?`}/>
              <Spacer gapsize='1'/>
              <FormField id="location" type="text" name="location" placeholder={user.location?user.location:locationplaceholder} className="pl-14"/>
              <div id="location pin" className='absolute top-9 left-3'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <Spacer gapsize='4'/>

            <div className='flex justify-end lg:pt-8'><Submit defaulttext='Save Changes' transitiontext="Saving..." submission={transition.submission}/></div>

          </Form>
        </fieldset>
        <Spacer gapsize='10'/>
    </main>
  )
}
