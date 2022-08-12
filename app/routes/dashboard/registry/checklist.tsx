import { Link } from "@remix-run/react"
import Heading from "~/components/dashboard/Heading"
import Sentence from "~/components/dashboard/Sentence"
import Spacer from "~/components/Spacer"
import { registrystoremenu } from "~/utils/allmenus"
import dashimages from "~/utils/dashimages"

function setImage(category:string){
    switch(category){
        case 'electronics':
            return <img src={dashimages.soundbar} alt={category}/>
        case 'dining essentials':
            return <img src={dashimages.diningessentials} alt={category}/>
        case 'cleaning':
            return <img src={dashimages.washingmachine} alt={category}/>
        case 'bedroom essentials':
            return <img src={dashimages.bedroomessentials} alt={category}/>
        case 'bathroom essentials':
            return <img src={dashimages.towels} alt={category}/>
        case 'drinkware':
            return <img src={dashimages.drinkware} alt={category}/>
        case 'home decor':
            return <img src={dashimages.tchotchke} alt={category}/>
        case 'kitchen appliances':
            return <img src={dashimages.kitchenappliances} alt={category}/>
        case 'kitchen essentials':
            return <img src={dashimages.pans} alt={category}/>
        default:
            return <img src={dashimages.pans} alt="default"/>
    }
}

export default function Checklist() {
  return (
    <main className="w-11/12 mx-auto">
        <Heading type="main" text="Checklist"/>
        <Spacer gapsize="1"/>
        <Sentence text="Not sure what to add to your registry? Check out items from these categories."/>
        <Spacer gapsize="2"/>
        <div className="pb-20 grid grid-cols-3 gap-x-2">
            {
                registrystoremenu.map(item=>{
                    return (
                        <Link to={item.url} className="my-4">
                            <div className="p-3 text-sm bg-pink-300 rounded-4xl shadow-xl">
                                <div className="mx-auto">{setImage(item.name.toLowerCase())}</div>
                            </div>
                            <p className="pt-4 text-sm text-center text-gray-700 font-bold">{item.name}</p>
                        </Link>
                        
                    )
                })
            }
        </div>
    </main>
  )
}
