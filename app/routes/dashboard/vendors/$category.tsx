import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react';
import CategoryMenu from '~/components/dashboard/CategoryMenu'
import Heading from '~/components/dashboard/Heading';
import Spacer from '~/components/Spacer'

// SERVER
export const loader:LoaderFunction=async({params})=>{
  const thepassedcategory=params.category;

  return json({
    data: {
      category: thepassedcategory?thepassedcategory:""
    }
  });
}

type LoaderData={
  data: {
    category: string
  }
}

// CLIENT
export default function VendorCategory() {
  const loaderdata:LoaderData=useLoaderData();

  return (
    <main>
      <Spacer gapsize="1"/>
      <div><CategoryMenu for="Vendors" heading="Categories" /></div>
        <Spacer gapsize="1"/>
        <div id="holder" className="py-4 bg-white shadow-lg rounded-lg">
          <div className='w-11/12 mx-auto'>
            <Heading type="main" text={loaderdata.data.category}/>
          </div>
        </div>
    </main>
  )
}
