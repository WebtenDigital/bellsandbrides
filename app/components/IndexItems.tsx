import { Link } from "@remix-run/react"

export type IndexItem={
    imageurl: string
    text: string
    url: string
}

type IndexItemProps={
    items: IndexItem[]
}


export default function IndexItems(props:IndexItemProps){
  return (
    <main>
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-none lg:flex lg:items-center lg:justify-between">
            {
                props.items.map(item=>{
                    return (
                        <div>
                            <Link to={item.url}>
                                <div >
                                    <div className="w-10/12 mx-auto flex justify-center p-4 bg-gray-50 rounded-3xl lg:w-full lg:rounded-4xl"><img src={item.imageurl} alt={item.text} className="h-20 w-20 object-cover lg:h-32 lg:w-32"/></div>
                                    <p className="pt-2 text-center text-gray-600 text-xs font-semibold lg:text-base lg:font-medium">{item.text}</p>
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    </main>
  )
}
