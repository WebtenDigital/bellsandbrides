import { Form, useTransition } from "@remix-run/react"

type RegistryItemCardProps={
    id: number
    imageurl: string
    name: string
    category: string
    price: number
}

export default function RegistryManagementCard(props:RegistryItemCardProps) {
  const transition=useTransition();
  return (
    <main className="p-2 flex gap-5 bg-gray-50 rounded-xl shadow-xl">
        <div id="left" className="w-4/12">
            <div id="image" className="h-full w-28">
                <img src={props.imageurl} alt={props.name} className="object-cover w-full h-full rounded-xl"/>
            </div>
        </div>
        <div id="right" className="w-full px-1">
          <p className="text-base text-gray-700 font-bold leading-tight">{props.name}</p>
          <p className="pt-1 text-xs text-gray-600 font-bold uppercase">ugx <span className="text-xl text-gray-500 font-bold">{props.price}</span></p>
          <div className="my-2 border-b border-gray-200"></div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-peach font-bold">Remove</p>
            <Form method="post">
              <input type="hidden" name="item_id" value={props.id}/>
              <button type="submit" className="">
                {
                  // <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  //   <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  // </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-peach" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                }
              </button>
            </Form>
          </div>
        </div>
    </main>
  )
}
