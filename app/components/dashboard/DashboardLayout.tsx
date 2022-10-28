import { Link } from "@remix-run/react"
import { mainDashMenu, MenuLink } from "~/utils/allmenus"
import Heading from "./Heading"

type DashboardLayoutProps={
    ceremony: string
    leftmenuarray: MenuLink[]
    maincontent: JSX.Element
    title?: string
    menuheading: string
}

export default function DashboardLayout(props:DashboardLayoutProps) {
  return (
    <main>
        <div className="">
            {/* main menu */}
            <div className="bg-gray-50 sticky top-[90px] z-30">
                <div className="px-6 py-2 flex items-center justify-between rounded-2xl bg-white">
                    <div id="wedding-symbol" className=""><div><svg className="h-12 w-12 fill-gray-400" viewBox="0 0 368.875 368.875"><path d="M184.487 109.53c4.683 0 13.712-5.525 26.839-16.424 9.066-7.526 20.398-18.07 25.012-25.087 3.498-5.318 7.439-12.798 6.866-23.515-.953-17.816-15.328-31.772-32.725-31.772-12.403 0-21.1 9.153-25.917 14.401-4.57-5.165-13.343-14.401-26.164-14.401-17.396 0-31.771 13.956-32.725 31.773-.58 10.857 3.642 18.622 6.869 23.518 7.129 10.822 41.574 41.507 51.945 41.507zM251.939 122.271c-25.123 0-48.42 7.966-67.501 21.501-19.081-13.536-42.378-21.501-67.501-21.501C52.458 122.271 0 174.729 0 239.207s52.458 116.936 116.936 116.936c25.123 0 48.42-7.965 67.501-21.501 19.081 13.536 42.378 21.501 67.501 21.501 64.479 0 116.936-52.457 116.936-116.936s-52.457-116.936-116.935-116.936zm-67.501 171.654c-12.144-14.953-19.435-33.999-19.435-54.718s7.29-39.766 19.435-54.719c12.144 14.953 19.435 33.999 19.435 54.719s-7.291 39.766-19.435 54.718zM30 239.207c0-47.937 39-86.937 86.936-86.937 16.41 0 31.771 4.572 44.88 12.506-16.741 20.235-26.813 46.178-26.813 74.43 0 28.252 10.072 54.195 26.813 74.43-13.109 7.934-28.47 12.506-44.88 12.506C69 326.143 30 287.144 30 239.207zm221.939 86.936c-16.409 0-31.771-4.572-44.88-12.506 16.741-20.235 26.813-46.178 26.813-74.43 0-28.252-10.072-54.196-26.813-74.43 13.109-7.934 28.47-12.506 44.88-12.506 47.937 0 86.936 39 86.936 86.937s-39 86.935-86.936 86.935z"/></svg></div></div>
                    
                    <div id="menu-items" className=" flex items-center gap-x-10">
                        {
                            mainDashMenu.slice(0,3).map(menuitem=>{
                                return (
                                    <Link to={menuitem.url}><div className="py-3 px-4 flex items-center gap-x-2 hover:bg-gray-100 hover:rounded-xl">
                                        <div id="icon">{menuitem.icon}</div>
                                        <div id="menu-item-name" className="text-gray-500 font-bold capitalize">{menuitem.name.toLowerCase()==="dashboard"?`My ${props.ceremony}`:menuitem.name.toLowerCase()==="vendors"?"Vendor Manager":menuitem.name}</div>
                                    </div></Link>
                                )
                            })
                        }
                    </div>

                    <div id="settings" className="p-3 hover:bg-gray-100 hover:rounded-xl">
                        <Link to={mainDashMenu[3].url}>{mainDashMenu[3].icon}</Link>
                    </div>
                </div>
            </div>

            {/* bottom */}
            <div className="fixed w-11/12 mx-auto top-[175px] flex gap-x-4">
                <div id="left" className="w-4/12 top-20  max-h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
                    <div className="py-5 mb-48 bg-white rounded-2xl">
                        <div id="back-to" className="w-10/12 mx-auto">
                            <p id="back-name" className="text-xs text-peach text-center font-bold uppercase">{props.menuheading}</p>
                        </div>

                        <div className="w-10/12 mx-auto my-4 border-b border-gray-200"></div>

                        <div className="px-2">
                            {props.leftmenuarray.map(item=>{
                                return (
                                    <Link to={item.url}>
                                        <div className="py-4 px-4 flex items-center gap-x-4 text-gray-600 font-semibold hover:bg-gray-100 hover:rounded-xl">
                                            <div className="">{item.icon}</div>
                                            <div>{item.name}</div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div id="right" className="w-full  max-h-screen overflow-y-auto bg-gray-50">
                    <div className="py-4 mb-48 bg-white rounded-2xl">
                        <div className="w-11/12 mx-auto">
                            <Heading type="main" text={props.title?props.title:""}/>
                        </div>
                        <div className="w-11/12 mx-auto">{props.maincontent}</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}
