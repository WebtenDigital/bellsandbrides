import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Nav from "~/components/Nav";
import { checkIfLoggedIn } from "~/utils/auth.server";
import { storage } from "~/utils/session";
import banner1 from '../images/homepage/banner1.jpg'
import banner2 from '../images/homepage/banner2.jpg'
import banner3 from '../images/homepage/banner3.jpg'
import banner4 from '../images/homepage/banner1.jpg'
import banner5 from '../images/homepage/banner2.jpg'
import banner6 from '../images/homepage/banner3.jpg'
import banner7 from '../images/homepage/banner1.jpg'
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import CTA from "~/components/dashboard/CTA";
import kitchenapp from '../images/others/registry-main-tp.png'
import bellsyoutube from '../images/others/bells-stories.png'
import videography from '../images/others/videography-tp.png'
import registryappliances from '../images/others/kitchen-appliances-tp.png'
import IndexItems, { IndexItem } from "~/components/IndexItems";
import dashimages from "~/utils/dashimages";
import yt3d from "../images/others/youtube-3d-tp.webp"
import Footer from "~/components/Footer";
import { db } from "~/utils/db.server";
import VendorSearch from "~/components/VendorSearch";

export const loader:LoaderFunction=async function({request}){
  const session=await storage.getSession(request.headers.get("Cookie"));
  const sessionId=session.get('userId');

  const loggedin=await checkIfLoggedIn(session);

  if(sessionId){
    // check registry for presence of items
    const user_registry=await db.user_registry_store.findMany({
      where: {
        user_id: parseInt(sessionId)
      }
    });

    const itemsinregistry=user_registry.length?true:false;

    return json({
      data:{
        loggedin: loggedin,
        itemsinregistry: itemsinregistry
      }
    });
  }
  else{
    return json({
      data:{
        loggedin: loggedin,
      }
    });
  }
}

type LoaderData={
  data: {
    loggedin: boolean
    itemsinregistry: boolean
  }
}

const bannerimages=[banner1, banner2, banner3, banner4, banner5, banner6, banner7];

type Summary={
  imageurl: string,
  title: string
  description: string
  ctatext: string
  ctaurl: string
}

const homesummary:Summary[]=[
  {
    imageurl: kitchenapp,
    title: 'Wedding Registry',
    description: 'Make it easy for your guests to know what you would like to be gifted.',
    ctatext: 'Start Building Registry',
    ctaurl: '/dashboard/registry'
  },
  {
    imageurl: videography,
    title: 'Find Vendors',
    description: 'Let us help you to find the best local service providers for your special day.',
    ctatext: 'Discover Vendors',
    ctaurl: '/vendors'
  },
  {
    imageurl: bellsyoutube,
    title: 'Bells Stories',
    description: 'Watch real stories of couples that already went through the journey.',
    ctatext: 'See Stories',
    ctaurl: '/stories'
  }
];

export default function Homepage(){
  // useState()
  const datetoday=new Date();
  const dayoftheweek=datetoday.getDay();

  const [currentbannerindex, setCurrentBannerIndex]=useState(dayoftheweek-1);

  const ceremonies=['wedding', 'intro', 'visitation'];
  const [currentceremonyindex, setCurrentCeremonyIndex]=useState(0);

  const storecategories:IndexItem[]=[
    {
      imageurl: dashimages.kitchenappliances,
      text: "Kitchen Essentials",
      url: ''
    },
    {
      imageurl: dashimages.washingmachine,
      text: "Cleaning",
      url: ''
    },
    {
      imageurl: dashimages.towels,
      text: "Bathroom Essentials",
      url: ''
    },
    {
      imageurl: dashimages.homedecor,
      text: "Home Decor",
      url: ''
    },
  ];

  const blogtopics:IndexItem[]=[
    {
      imageurl: dashimages.weddingservices,
      text: "Wedding Services",
      url: ''
    },
    {
      imageurl: dashimages.planningadvice,
      text: "Planning Advice",
      url: ''
    },
    {
      imageurl: dashimages.destinationweddings,
      text: "Destination Weddings",
      url: ''
    },
    {
      imageurl: dashimages.weddingfashion,
      text: "Wedding Fashion",
      url: ''
    },
  ];

  useEffect(()=>{
    setTimeout(()=>{
      setCurrentCeremonyIndex((prevstate)=>{
        if(currentceremonyindex<ceremonies.length-1){
          return prevstate=prevstate+1;
        }
        else return prevstate=0;
      });
    }, 2000);
  });


  const loaderdata:LoaderData=useLoaderData();
  const loggedin=loaderdata.data.loggedin

  const itemsinregistry=loaderdata.data.itemsinregistry;

  function smallVendorCard(imageurl:string, text:string, url:string){
    return (
      <Link to={url}><div>
        <div className="py-1"><img src={imageurl} alt={text} className="rounded-2xl"/></div>
        <p className="py-1 text-center text-sm text-pink-400 font-semibold bg-white rounded-xl">{text}</p>
      </div></Link>
    )
  }

  return(
    <main className="">
      <div>
        <div className="w-11/12 mx-auto"><Nav loggedin={loggedin}/></div>
          <div className="pt-2"><img src={bannerimages[currentbannerindex]} alt="wedding-banner"/></div>
          <section id="banner" className="bg-gray-50">
            <div id="holder" className="w-10/12 mx-auto pt-6 pb-8">
              <Heading type="hero" text={`Start putting together a team for your ${ceremonies[currentceremonyindex]}.`}/>
              <div className="text-justify py-4"><Sentence text="Looking for a photographer, caterer and decor service provider but do not know where to begin? Look no further. Let us help you to assemble your introduction’s dream team."/></div>
              {loggedin?
              <div><VendorSearch/></div>
              :
              <CTA type="filledwitharrowtwo" text="Start Here" url="/myaccount"/>}
            </div>
          </section>


          {/* summary */}
          <section>
            <div className="w-10/12 mx-auto py-16">
              {
                homesummary.map(item=>{
                  return (
                    <div className={`${item.title.toLowerCase()==='wedding registry'?"mb-32":"mb-12"}`}>
                      <div className="relative w-10/12 mx-auto h-36 bg-pink-200 rounded-2xl">
                        <div className="absolute bottom-4"><img src={item.imageurl}/></div>
                      </div>
                      <div className="w-10/12 mx-auto mt-2 py-6 bg-gray-50 rounded-2xl shadow-xl">
                        <div className="w-11/12 mx-auto">
                          <div className="text-center"><Heading type="mid" text={item.title}/></div>
                          <div className="text-center pt-3 pb-4"><Sentence text={item.description}/></div>
                          <div className="px-1">
                            <Link to={item.ctaurl} className="block w-full px-4 py-2 text-sm text-center text-peach font-medium border border-peach border-opacity-80 rounded-xl">{item.ctatext}</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </section>

          {/* registry */}
          <section className="bg-[#FFFBFB] py-12">
            <div className="w-10/12 mx-auto">
              <Heading type="sub" text="Registry"/>
              <Heading type="mid" text="Make It Easy For Your Guests to Gift You."/>

              <div>
                <div className="w-10/12 mx-auto py-2 relative flex justify-center">
                  <div id="circle" className="w-48 h-48 bg-[#FFEDEC] rounded-full">
                    <div className="absolute top-8 right-1 -mt-2"><img src={registryappliances} className=""/></div>
                  </div>
                </div>
                <div className="pt-4 pb-6 text-justify"><Sentence text="Your guests want to give you gifts on your special day, but they have no idea what you would like. Make it easy for them by creating a registry with all the gifts you would like. They will thank you."/></div>
                <div className="px-1">
                  <Link to={loggedin&&itemsinregistry?"dashboard/registry/manage":"/dashboard/registry"} className="block w-full px-4 py-2 text-sm text-center text-peach font-medium border border-peach border-opacity-80 rounded-xl">{loggedin&&itemsinregistry?"Manage Registry":'Set Up Registry'}</Link>
                </div>
              </div>
            </div>
          </section>

          {/* store */}
          <section className="py-12">
            <div className="w-10/12 mx-auto">
              <Heading type="sub" text="Shop"/>
              <Heading type="mid" text="From Kitchen to Bathroom Essentials, Our Store Has It All"/>

              <div className="py-8"><IndexItems items={storecategories}/></div>

              <div className="flex justify-end"><CTA type="arrownoborder" text="See All" url=""/></div>
            </div>
          </section>

          {/* vendors */}
          <section className="py-12 bg-[#FF77C9]">
            <div className="w-10/12 mx-auto">
              <Heading type="sub" textcolor="white" text="Vendors"/>
              <Heading type="mid" textcolor="white" text="Find the Best Local Wedding Vendors Here"/>
              <div className="py-4"><Sentence className="text-white" text="Bells and Brides has verified every service provider listed. We have made sure that we only provide the best vendors around. Start your search to start putting together a team that will bring your special day to life."/></div>
            
              <div className="flex justify-between items-center gap-4">
                <div className="w-5/12">{smallVendorCard(dashimages.catering, "catering", "/vendors/catering")}</div>
                <div id="heart" className="w-2/12 h-12 w-12 bg-white rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 ml-1 h-10 w-10 text-peach" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div className="w-5/12">{smallVendorCard(dashimages.venue, "venue", "/vendors/venue")}</div>
              </div>
              <div className="pt-10"><Link to="/vendors" className="block w-full px-4 py-3 text-center text-sm text-pink-400 font-medium bg-white rounded-2xl">Find Vendors in Your Area</Link></div>
            </div>
          </section>

          {/* Ideas */}
          <section className="pt-12">
            <div className="w-10/12 mx-auto">
              <Heading type="sub" text="Ideas"/>
              <div className="flex items-start justify-between">
                <div>
                  <Heading type="mid" text="Get Expert Advice"/>
                </div>
                <div><CTA type="emptywitharrownoborder" text="See Ideas" url="/blog"/></div>
              </div>
              <div id="circular-image" className="py-4"><img src={banner3} className="h-56 w-56 object-cover rounded-full shadow-xl"/></div>
              <div className="text-justify"><Sentence text="Looking for some ideas, tips and inspiration for your own wedding? Browse and read our articles written by experts in the wedding industry on all the aspects of organizing a world class ceremony."/></div>
            </div>

            <div id="browse" className="pt-12">
              <div className="w-10/12 mx-auto border-b border-t border-gray-200">
                <div className="pl-4 py-8"><Heading type="sub" text="Browse by Topic"/></div>
                <IndexItems items={blogtopics}/>
                <div className="py-8 flex justify-end"><CTA type="arrownoborder" text="See All" url="/blog"/></div>
              </div>
            </div>
          </section>

          {/* bells stories */}
          <section className="pt-12 pb-16">
            <div className="w-10/12 mx-auto">
              <Heading type="sub" text="Bells Stories"/>
              <Heading type="mid" text="Watch Real wedding Stories"/>
              <div id="circular-image" className="relative py-4">
                <img src={banner1} className="h-56 w-56 object-cover rounded-full shadow-xl"/>
                <div className="absolute bottom-5 right-16 w-3/12"><img src={yt3d}/></div>
              </div>
              <div className="text-justify"><Sentence text="Looking for some real life inspiration? Watch stories from couples that already did their introductions, visitations and weddings. Visit our Bells and Brides TV YouTube channel to subscribe and get started."/></div>
              
              <div id="ctas" className="flex justify-between items-center gap-4 pt-8">
                <div className="w-1/2"><CTA type="empty" text="Watch Stories" url="/stories" bordercolor="peach"/></div>
                <div className="w-1/2">
                  <Link to="" className={`block w-full px-4 py-2 flex gap-2 items-center justify-between text-sm text-peach text-white font-medium bg-peach rounded-2xl`}>
                    Subscribe
                    <div id="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                  </Link>              
                </div>
              </div>
            </div>
          </section>

          {/* sign up */}
          {!loggedin&&<section className="py-12 bg-[#FF77C9]">
            <div className="w-10/12 mx-auto">
              <div className="text-center"><Heading type="sub" textcolor="white" text="Vendors"/></div>
              <div className="text-center"><Heading type="mid" textcolor="white" text="Sign Up to Get Started"/></div>       
              <div className="w-9/12 mx-auto pt-10"><Link to="/myaccount" className="block w-full px-4 py-3 text-center text-sm text-pink-400 font-medium bg-white rounded-2xl">Sign Up</Link></div>
            </div>
          </section>}

          {/* footer */}
          <Footer/>
      </div> 
    </main>
  )
}