import { useState } from "react";

type DropDownProps={
    placeholder: string
    options: string[]
    getChosenValue: (chosenvalue:string)=>void
}

export default function DropDown(props:DropDownProps) {
    const [chosenvalue, setChosenValue]=useState(props.placeholder);
    const [showdropdown, setShowDropDown]=useState(false);

    props.getChosenValue(chosenvalue);

  return (
    <main className="relative">    
        <button type="button" className="block w-full px-4 py-2 border border-gray-100 rounded-xl" onClick={()=>{setShowDropDown(prevstate=>prevstate=!prevstate)}}>
            <div className="flex justify-between">
                <p className="text-sm text-gray-400">{chosenvalue}</p>
                <div id="dropdownicon">
                    <div>
                        {
                            !showdropdown?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                        }
                    </div>
                </div>
            </div>
        </button>
        <div id="dropdown" className="absolute top-10 z-10">
            {
                showdropdown&&<div className="w-full pl-4 pr-40 py-3 bg-gray-50 border border-gray-100 rounded-lg">
                    {
                        props.options.map(item=>{
                            return (
                                <button className="block w-full py-1 text-left text-sm text-gray-500" onClick={(event)=>{setShowDropDown(false); setChosenValue(event.currentTarget.textContent?event.currentTarget.textContent:props.placeholder)}}>{item}</button>
                            )
                        })
                    }
                </div>
            }
        </div>
    </main>
  )
}
