import { vendors } from "@prisma/client"
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import CTA from "~/components/dashboard/CTA"
import Heading from "~/components/dashboard/Heading"
import { db } from "~/utils/db.server"
import { adminsessionstorage } from "~/utils/session"
import bellsadmin from '../../images/others/bells-admin.png'

// Action
export const action:ActionFunction=async({request})=>{
    const formdata=await request.formData();
    const vendorid=formdata.get("vendor_id");

    // change the approved_status to 1
    if(vendorid){
        const changeapprovedstatus=await db.vendors.update({
            where: {
                id: parseInt(vendorid.toString())
            },
            data: {
                approved: 1
            }
        });


        // send email to login
        const vendor=await db.vendors.findUnique({
            where: {
                id: parseInt(vendorid.toString())
            }
        });

        // the email
        const email=vendor?.vendor_email;

        // the uq
        const uq=vendor?.uq;

        console.log(uq);

        // the link
        // const approvedlink=`https://bellsandbrides.com/bellsvendor/myaccount?uq=${uq}`;
        const approvedlink=`/bellsvendor/myaccount?uq=${uq}&&formtype=register`;

        return redirect(approvedlink);
    }

    return null;
}

// Loader
export const loader:LoaderFunction=async({request})=>{
    const session=await adminsessionstorage.getSession(request.headers.get("Cookie"));
    const adminpwd=session.get("admin_pwd");

    if(adminpwd){
        // if there is an active session...
        const unapprovedvendors=await db.vendors.findMany({
            where: {
                approved: 0
            }
        });
    
        return json({
            data: {
                unapprovedvendors: unapprovedvendors
            }
        });
    }
    else {
        return redirect('/admin/login');
    }
}

type LoaderData={
    data: {
        unapprovedvendors: vendors[]
    }
}

export default function AdminDashboard() {
    const loaderdata=(useLoaderData<LoaderData>()).data;

  return (
    <main>
        <div className="py-4 w-11/12 mx-auto">
            <div className="w-full flex items-center justify-between">
                <div className="w-1/2"><img src={bellsadmin} alt="bells-admin"/></div>
                <div><CTA type="fillednoarrow" url="/admin/logout" text="Logout"/></div>
            </div>
        </div>

        <div className="py-4 w-11/12 mx-auto">
            <Heading type="main" text="Pending Approvement"/>
        </div>

        <div className="w-11/12 mx-auto">{
            loaderdata.unapprovedvendors.map(vendor=>{
                return (
                    <div className="my-2">
                        <div className="px-2 bg-gray-50 rounded-lg">
                            <div className="py-2 flex items-center justify-between">
                                <h2 className="w-6/12 font-semibold text-sm text-gray-600">{vendor.vendor_name}</h2>
                                <div id="show-details" className="w-5/12">
                                    <button className="px-1 py-1 flex items-center justify-between bg-pink-400 text-white rounded-md">
                                        <p className="text-xs font-medium">Show Details</p>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                                <div id="approve" className="w-3/12">
                                    <Form method="post">
                                        <input type="hidden" name="vendor_id" value={vendor.id}/>
                                        <button type="submit" className="w-full px-1 py-1 text-xs text-white bg-peach font-medium rounded-md">Approve</button>
                                    </Form>
                                </div>
                            </div>                            
                        </div>
                    </div>
                )
            })
        }</div>
    </main>
  )
}
