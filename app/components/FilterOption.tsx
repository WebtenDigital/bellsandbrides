import { useEffect, useRef, useState } from "react";

type FilterOptionProps={
    filtername: string
    filteroptions: string[]|number[]
    handleClick: (value:string, filtertype:string)=>void //*fix typescript*
}

export default function FilterOption(props:FilterOptionProps) {
    const [showoptions, setShowOptions]=useState(false);

    const dropdownref=useRef<HTMLHeadingElement>(null);

    useEffect(()=>{
        function handleClickOutside(event:any){
            if(dropdownref.current&&!dropdownref.current.contains(event.target)){
                setShowOptions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownref]);

  return (
    <div className="relative">
        <button className="py-1 px-2 flex items-center gap-1 justify-between bg-gray-200 rounded-lg" onClick={()=>{setShowOptions(prevstate=>prevstate=!prevstate)}}>
            <p className="text-sm text-gray-500 font-semibold uppercase">{props.filtername}</p>
            <div id="down-icon">
                {showoptions?
                <svg id="down" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                :
                <svg id="up" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>}
            </div>
        </button>

        {showoptions&&<div ref={dropdownref} id="the options" className="absolute top-8 -left-1 px-4 py-2 bg-gray-100 rounded-lg shadow-lg">
            {
                props.filteroptions.map(option=>{
                    return (
                        <div className="pb-2 text-sm text-gray-600"><button className="w-full text-left whitespace-nowrap" onClick={(event)=>{props.handleClick(event.currentTarget.innerText.toLowerCase(), props.filtername); setShowOptions(false)}}>{option}</button></div>
                    )
                })
            }
        </div>}

    </div>
  )
}
