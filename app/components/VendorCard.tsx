import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import dashimages from "~/utils/dashimages";
import Separator from "./Separator";
import Spacer from "./Spacer";

type VendorProps={
    vendorId: number
    vendorname: string
    category: string
    baseprice: number
    slug: string
    currentlikedstatus?: string
    loggedin: boolean
}

export default function VendorCard(props:VendorProps) {
  const [liked, setLiked]=useState(props.currentlikedstatus==="liked"?true:false);

  function setHeart(likedstatus:boolean){
      if(likedstatus){
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-peach" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
        )
      }  
      else{
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      }  
  }

  return (
    <main>
        {/* NEW DESIGN */}
        <div className="w-9/12">
          <div id="image"><Link to={`/vendors/${props.category}/${props.slug}`}><img src={dashimages.venue} className="h-20 w-full object-cover object-top rounded-2xl shadow-xl"/></Link></div>
          {/* <Spacer gapsize="1"/> */}
          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-xl shadow-xl">
            <div className="flex justify-between items-center">
              
              <div><p className="px-2 bg-[#F1B2D8] text-[#E948A9] text-xs font-semibold uppercase rounded-full">{props.category}</p></div>
              {/* heart */}
              {props.loggedin?<div><Form method="post">
                {/* send back the vendor's Id - both when liked and unliked*/}
                <input type="hidden" value={props.vendorId} name="vendor_id"/>
                <input type="hidden" value={liked?"liked":"unliked"} name="likedstatus"/>
                <input type="hidden" value={props.category} name="vendor_category"/>

                <button onClick={()=>{setLiked(prevstate=>prevstate=!prevstate)}}>
                  {
                    setHeart(liked)
                  }                    
                </button>
              </Form></div>
              :
              <Link to="/myaccount?from=vendors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              }
            </div>



            {/* title */}
            <Link to={`/vendor/${props.slug}`}>
              <h2 className="py- text-gray-600 text-base text-lg font-bold leading-tight">{props.vendorname}</h2>

              {/* price */}
              <div className="pt-1  flex items-end justify-between">
                <p className="pb-1 text-xs text-gray-400 font-semibold uppercase">starting price</p>
                <p className="text-xl text-gray-500 font-semibold"><span className="text-xs">UGX </span>{props.baseprice}</p>
              </div>

              <div className="py-3"><Separator bordercolor={"gray-200"}/></div>
            </Link>

            {/* request pricing */}
            <div className="flex justify-between">
              <div id="email icon">
                <svg className="h-8 w-8 fill-peach" viewBox="0 0 299.997 299.997"><path d="M149.996 0C67.157 0 .001 67.158.001 149.997c0 82.837 67.156 150 149.995 150s150-67.163 150-150C299.996 67.158 232.835 0 149.996 0zm.003 52.686 88.763 55.35H61.236l88.763-55.35zm89.869 143.737h-.009c0 8.878-7.195 16.072-16.072 16.072H76.211c-8.878 0-16.072-7.195-16.072-16.072v-84.865c0-.939.096-1.852.252-2.749l84.808 52.883c.104.065.215.109.322.169.112.062.226.122.34.179a8.903 8.903 0 0 0 1.847.721c.065.018.13.026.195.041a9.148 9.148 0 0 0 2.093.265h.015c.7 0 1.401-.099 2.093-.265.065-.016.13-.023.195-.041a8.99 8.99 0 0 0 1.847-.721 9.19 9.19 0 0 0 .34-.179c.106-.06.218-.104.322-.169l84.808-52.883c.156.897.252 1.808.252 2.749v84.865z"/></svg>
              </div>
              <div>
                <Link to="" className="flex items-center gap-2">
                  <p className="text-sm text-peach font-semibold">Request Pricing</p>
                  <div id="the-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-peach" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
        <Spacer gapsize="2"/>
    </main>
  )
}
