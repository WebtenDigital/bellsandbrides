import { Link } from "@remix-run/react";
import { useState } from "react";
import { vendorCategories } from "~/utils/vendorcategories";
import { setIcon } from "~/components/dashboard/VendorCategory";

export default function VendorSearch() {
    const [chosencategory, setChosenCategory]=useState('Find Vendor');
    const [showdropdown, setShowDropDown]=useState(false);
  
    function handleClick(){
      setShowDropDown(prevstate=>{
        return prevstate=!prevstate;
      })
    }
    
  return (
    <main>
        <div className="relative w-full flex">
                <button onClick={()=>{handleClick()}} className="block w-full px-4 flex justify-between items-center bg-white rounded-l-lg">
                  <p className="text-sm text-gray-600 font-medium">{chosencategory}</p>
                  <div>
                    {showdropdown?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    }
                  </div>
                </button>
                <Link to={chosencategory.toLowerCase()==='find vendor'?"/vendors":`/vendors/${chosencategory.toLowerCase()}`} className="block w-3/12 px-4 py-2 bg-peach text-white text-sm rounded-r-lg">Search</Link>
              
                {/* dropdown */}
                {showdropdown&&<div className="absolute top-10 z-20 grid grid-cols-2 px-4 py-4 bg-gray-100 rounded-lg">
                    {
                      vendorCategories.map(category=>{
                        return (
                          <button className="block flex gap-4 py-2" onClick={(event)=>{setChosenCategory(event.currentTarget.textContent?event.currentTarget.textContent:""); setShowDropDown(false)}}>
                            <div className="w-2/12">{setIcon(category, 'w-6', 'h-6')}</div>
                            <p className="text-sm text-gray-600 font-semibold">{category}</p>
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
