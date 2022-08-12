import { Form, Link, useTransition } from "@remix-run/react";

export default function VendorSearch() {
    // const transition=useTransition();
  return (
    <main>
        <Form method="post" action="/search">
            <div className="flex shadow-xl rounded-xl">
                <input type="text" name="search" placeholder="Search vendors..." className="w-full pl-4 text-sm rounded-l-xl focus:outline-none"/>
                <button type="submit" className="py-3 px-4 text-sm text-white font-semibold bg-peach rounded-r-xl">{`Search`}</button>
            </div>
        </Form>

    </main>
  )
}
