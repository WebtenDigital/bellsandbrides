import { Link } from "@remix-run/react";
import { useState } from "react"
import { dashboardaccountmenu, dashboardregistrymenu, dashboardvendormenu, MenuLink } from "~/utils/allmenus";
import Separator from "../Separator";
import Spacer from "../Spacer";

type CategoryMenuProps={
    for: "Account"|"Vendors"|"Registry",
    heading: "Account Options"|"Categories"|"Registry Options"
}

function setCategoryMenu(type:"Account"|"Vendors"|"Registry"){
    switch (type){
        case "Account":
            return dashboardaccountmenu;
        case "Vendors":
            return dashboardvendormenu;
        case "Registry":
            return dashboardregistrymenu;
    }
}

export default function CategoryMenu(props:CategoryMenuProps) {
    const [showdropdown, setDropDown]=useState(false);
    const menuarray=setCategoryMenu(props.for);

  return (
    <main className="bg-white shadow-xl rounded-lg">
        <div className="px-4 py-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-bold uppercase">{props.for}</p>
            <div className="relative flex items-center gap-3">
                <h4 className="text-xs text-gray-500 font-bold uppercase">Options</h4>
                <button className="flex items-center gap-3" onClick={()=>{setDropDown(prevstate=>prevstate=!prevstate)}}>
                    <div id="icon"><svg className="h-7 w-7 fill-gray-600" viewBox="0 0 210 210"><path d="M195 0h-20c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15V15c0-8.284-6.716-15-15-15zM115 0H95c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15V15c0-8.284-6.716-15-15-15zM35 0H15C6.716 0 0 6.716 0 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15V15c0-8.284-6.716-15-15-15zM195 160h-20c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15v-20c0-8.284-6.716-15-15-15zM115 160H95c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15v-20c0-8.284-6.716-15-15-15zM35 160H15c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15v-20c0-8.284-6.716-15-15-15zM195 80h-20c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15V95c0-8.284-6.716-15-15-15zM115 80H95c-8.284 0-15 6.716-15 15v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15V95c0-8.284-6.716-15-15-15zM35 80H15C6.716 80 0 86.716 0 95v20c0 8.284 6.716 15 15 15h20c8.284 0 15-6.716 15-15V95c0-8.284-6.716-15-15-15z"/></svg></div>
                </button>
                {showdropdown&&<div id="category-menu-drop-down" className="absolute top-8 -right-4 z-60 py-4 pl-4 pr-12 bg-gray-100 rounded-lg">
                    <p className="text-sm text-peach text-center font-semibold uppercase whitespace-nowrap">{props.heading}</p>
                    <div className="pt-3 pb-2"><Separator bordercolor="gray-200"/></div>
                    {
                        menuarray.map(menuitem=>{
                            return (
                                <Link to={menuitem.url} onClick={()=>{setDropDown(false)}}><div className="w-full px-2 py-2 text-sm text-gray-600 font-bold whitespace-nowrap">{menuitem.name}</div></Link>
                            )
                        })
                    }
                </div>}
            </div>
        </div>
    </main>
  )
}