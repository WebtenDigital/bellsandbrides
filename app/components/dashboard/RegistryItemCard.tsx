import { Form, useTransition } from "@remix-run/react"

type RegistryItemCardProps={
    id: number
    imageurl: string
    name: string
    category: string
    price: number
}

export default function RegistryItemCard(props:RegistryItemCardProps) {
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
            <p className="text-sm text-peach font-bold">Add to Registry</p>
            <Form method="post">
              <input type="hidden" name="item_id" value={props.id}/>
              <button type="submit" className="p-1 bg-peach text-center text-lg text-white rounded-lg">
                {
                  // <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  //   <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  // </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                }
              </button>
            </Form>
          </div>
        </div>
    </main>
  )
}
