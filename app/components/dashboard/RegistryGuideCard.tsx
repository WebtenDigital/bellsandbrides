import { Link } from "@remix-run/react"
import { useState } from "react"
import Sentence from "./Sentence"

export type RegistryGuideItem={
    icon: JSX.Element
    title: string
    description: string
    url: string
    showcard: boolean
  }

export default function RegistryGuideCard(props: RegistryGuideItem) {
    // const [showcard, setShowCard]=useState(true);
  return (
    <main className="lg:hover:scale-110">
        {props.showcard&&<Link to={props.url}><div className="pl-3 pr-4 py-3 flex items-center gap-4 bg-white shadow-lg rounded-lg">
            <div id="icon" className="p-6  bg-[#FFD5D1] rounded-full">{props.icon}</div>
            <div id="right">
                <div className="flex justify-between items-center">
                <h3 className="text-sm text-gray-700 font-bold lg:text-base">{props.title}</h3>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
                <div id="line" className="my-2 border-b border-gray-300 lg:my-4"></div>
                <div>
                <Sentence text={props.description}/>
                </div>
            </div>
        </div></Link>}
    </main>
  )
}
