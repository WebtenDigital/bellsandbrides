import { Link } from "@remix-run/react"
import { mainDashMenu } from "~/utils/allmenus"

type FooterProps={
    type: string
    routename: "dashboard"|"vendors"|"registry"|"account"
}

function setDashMenu(routename:string){
    return mainDashMenu.map(dashmenuitem=>{
        if(dashmenuitem.name===routename){
            return(
                <button className="p-2 bg-gray-200 rounded-xl"><Link to={dashmenuitem.url}>{dashmenuitem.icon}</Link></button>
            )                        
        }
        else{
            return(
                <button><Link to={dashmenuitem.url}>{dashmenuitem.icon}</Link></button>
            )
        }                    
    });
}

export default function DashFooter(props:FooterProps) {
  return (
    <main className="fixed bottom-0 right-0 w-full px-2">
        <div className="py-2 bg-white rounded-xl">
            <div className="w-10/12 mx-auto ">
                <div className="w-full flex items-center justify-between">
                    {
                        setDashMenu(props.routename)
                    }                   
                </div>
            </div>
        </div>
    </main>
  )
}
