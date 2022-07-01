import { Link } from "@remix-run/react"
import { mainDashMenu } from "~/utils/allmenus"

type FooterProps={
    type: string
}

export default function DashFooter(props:FooterProps) {
  return (
    <main className="fixed bottom-0 right-0 w-full px-2">
        <div className="py-3 bg-white rounded-xl">
            <div className="w-10/12 mx-auto ">
            
                <div className="w-full flex items-center justify-between">
                    {
                        mainDashMenu.map(dashmenuitem=>{
                            return(
                                <div><Link to={dashmenuitem.url}>{dashmenuitem.icon}</Link></div>
                            )
                        })
                    }                    
                </div>
            </div>
        </div>
    </main>
  )
}
