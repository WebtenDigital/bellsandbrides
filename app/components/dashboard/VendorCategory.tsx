import { Link } from "@remix-run/react";
import setIcon from "~/utils/iconsetter";
import Spacer from "../Spacer";

type VendorCategoryProps={
    // type: "box"|"round"
    categoryname: string
    howmanyvendors: number
}

export default function VendorCategory(props:VendorCategoryProps) {
    const icon=setIcon(props.categoryname);

  return (
    <Link to={`/dashboard/vendormanager/${props.categoryname.toLowerCase()}`}><main className="relative py-3 bg-pink-300 rounded-2xl shadow-xl lg:py-4 lg:rounded-4xl lg:hover:shadow-2xl lg:hover:scale-110">
        <div className="">
            <div id="the icon" className="flex justify-center">{icon}</div>
            <Spacer gapsize="1"/>
            <p className="text-center text-gray-700 text-sm font-semibold lg:py-2 lg:text-base lg:text-gray-600">{props.categoryname}</p>
        </div>
        {props.howmanyvendors?<div id="the number" className="h-6 w-6 absolute -top-2 -right-2 text-center text-sm text-white font-bold bg-peach rounded-full lg:h-9 lg:w-9 lg:text-base"><div className="pt-1">{props.howmanyvendors}</div></div>:""}
    </main></Link>
  )
}
