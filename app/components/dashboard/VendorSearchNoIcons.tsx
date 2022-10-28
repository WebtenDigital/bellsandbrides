import { Link } from "@remix-run/react";
import { useState } from "react";
import { vendorCategories } from "~/utils/vendorcategories";
import { setIcon } from "~/components/dashboard/VendorCategory";

export default function VendorSearchNoIcons() {
    const [chosencategory, setChosenCategory]=useState('Find Vendor');
    const [showdropdown, setShowDropDown]=useState(false);
  
    function handleClick(){
      setShowDropDown(prevstate=>{
        return prevstate=!prevstate;
      })
    }
    
  return (
    <main>
        <div className="relative w-full flex lg:shadow-xl lg:rounded-xl">
                <button onClick={()=>{handleClick()}} className="block w-full px-4 flex justify-between items-center bg-white rounded-l-lg ">
                  <p className="text-sm text-gray-600 font-medium lg:text-base">{chosencategory}</p>
                  <div>
                    {showdropdown?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 lg:h-6 lg:w-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 lg:h-6 lg:w-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    }
                  </div>
                </button>
                <Link to={chosencategory.toLowerCase()==='find vendor'?"/vendors":`/vendors/${chosencategory.toLowerCase()}`} className="block w-3/12 px-4 py-2 bg-peach text-white text-sm rounded-r-lg lg:py-3 lg:text-base lg:text-center">Search</Link>
              
                {/* dropdown */}
                {showdropdown&&<div className="absolute top-10 z-20 grid grid-cols-2 px-4 py-4 bg-gray-100 rounded-lg lg:top-14 lg:-mt-1 lg:px-8 lg:py-5 lg:grid lg:grid-cols-3 lg:grid lg:gap-x-8">
                    {
                      vendorCategories.map(category=>{
                        return (
                          <button className="block flex gap-4 py-2 lg:flex lg:items-center lg:gap-x-6 lg:pl-2 lg:py-3 lg:hover:pl-2 lg:hover:bg-white lg:hover:rounded-xl" onClick={(event)=>{setChosenCategory(event.currentTarget.textContent?event.currentTarget.textContent:""); setShowDropDown(false)}}>
                            {/* <div className="w-2/12 lg:hidden">{setIcon(category, 'w-6', 'h-6')}</div> */}
                            {/* <div className="hidden w-2/12 lg:block">{setIcon(category, 'w-10', 'h-10')}</div> */}
                            <p className="text-sm text-gray-600 font-semibold lg:text-sm lg:font-medium">{category}</p>
                            {/* {category} */}
                          </button>
                        )
                      })
                    }
                </div>}
              </div>
    </main>
  )
}
