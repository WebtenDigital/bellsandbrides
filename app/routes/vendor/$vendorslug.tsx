import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";

// SERVER
// Loader
export const loader:LoaderFunction=async({params})=>{
    const vendorname=params.vendorslug;

    return json({
        data: {
            vendorname: vendorname
        }
    });
}

type LoaderData={
    data: {
        vendorname: string
    }
}

// CLIENT
export default function $VendorDetails() {
    const loaderdata=useLoaderData<LoaderData>();
    const vendorname=loaderdata.data.vendorname;

  return (
    <div>{vendorname}</div>
  )
}
