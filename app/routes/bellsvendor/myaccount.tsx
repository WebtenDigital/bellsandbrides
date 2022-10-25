import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import FormField from "~/components/FormField";
import SuperSpinner from "~/components/SuperSpinner";
import { db } from "~/utils/db.server";
import { vendorsessionstorage } from "~/utils/session";
import bells from '../../images/bellsandbrides-line-tp.png'

export const action:ActionFunction=async({request})=>{
    const formdata=await request.formData();
    // register
    const regusername=formdata.get("reg_username")?.toString();
    const regpassword=formdata.get("reg_password")?.toString();
    const uq=formdata.get("uq")?.toString();

    // login
    const logusername=formdata.get("log_username")?.toString();
    const logpassword=formdata.get("log_password")?.toString();

    if(regusername&&regpassword){
        // update database, create new session and redirect to vendor dashboard
        const addusernameandpassword=await db.vendors.update({
            where: {
                uq: uq
            },
            data: {
                username: regusername,
                password: regpassword
            }
        });

        const session=await vendorsessionstorage.getSession(); //create a session from scratch
        session.set("vendor_id", addusernameandpassword.id);

        return redirect("/bellsvendor/dashboard", {
            headers: {
                "Set-Cookie": await vendorsessionstorage.commitSession(session)
            }
        })
    }
    // if password has been input
    else if(!logpassword){
        return json({
            data: {
                errormessage: "You did not enter a password!"
            }
        });        
    }
    else if(logusername&&logpassword){
        // authenticate, create new session and redirect to vendor dashboard
        // check if the username and password exist
        const checkforusername=await db.vendors.findMany({
            where: {
                username: logusername
            }
        });
        const checkforpassword=await db.vendors.findMany({
            where: {
                username: logusername,
                password: logpassword
            }
        });

        // return error feedback
        // if username is incorrect
        if(!checkforusername.length){
            return json({
                data: {
                    errormessage: "Username is incorrect!"
                }
            });
        }
        // if username is correct but password is not
        else if(checkforusername&&!checkforpassword){
            return json({
                data: {
                    errormessage: "Password is incorrect!"
                }
            });
        }
        else {
            // create a new session and redirect
            const session=await vendorsessionstorage.getSession();
            session.set("vendor_id", checkforpassword.map(vendor=>vendor.id)[0]);
            
            return redirect("/bellsvendor/dashboard", {
                headers: {
                    "Set-Cookie": await vendorsessionstorage.commitSession(session)
                }
            });
        }
    }
    else return null;
}

export const loader:LoaderFunction=async({request})=>{
    // grab the uq from searchparams and send it to client
    const url=new URL(request.url);
    const formtype=url.searchParams.get("formtype");
    const uq=url.searchParams.get("uq");

    return json({
        data: {
            formtype: formtype,
            uq: uq
        }
    })    
}

type LoaderData={
    data: {
        formtype: string|null
        uq: string
    }
}

type ActionData={
    data: {
        errormessage: string
    }
}

// CLIENT
export default function MyAccount() {
    const loaderdata=useLoaderData<LoaderData>().data;
    const actiondata=useActionData<ActionData>()?.data;

    const uq=loaderdata.uq;

    const transition=useTransition();

    const [formtype, setFormType]=useState(loaderdata.formtype?loaderdata.formtype:"login")
    
  return (
    <main>
        <div className="w-10/12 mx-auto pt-8 lg:w-4/12 lg:py-10 lg:px-10 lg:bg-white lg:rounded-xl">
        <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="h-7 w-7 pt-0.5 pl-1 bg-purple-300 bg-opacity-40 rounded-full">
                        {formtype==="register"?<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>:
                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                        </svg>}
                    </div>
                    <p className="text-center text-xl text-gray-700 font-bold">{formtype==='register'?"Sign Up":"Login"}</p>
                </div>
                <Link to="/" className="w-6/12 -mt-2">
                    <img src={bells}/>
                </Link>
            </div>

            {
                formtype==='register'?
                <p className="pt-4 text-gray-500 text-sm">Sign up here to start managing your vendor account</p>
                :
                <p className="pt-4 text-gray-500 text-sm">Log in to your Bells Vendor account</p>              
            }

            {/* error messages */}
            {
                actiondata?.errormessage?<div className="pt-4 pb-3">
                    <div></div>
                    <p className="text-sm text-red-500 italic">{actiondata?.errormessage}</p>
                </div>:<div></div>
            }

            <div>
                {
                    formtype==="register"?
                    <div id="register-form">
                        <Form method="post">
                            <input type="hidden" name="uq" value={uq}/>
                            <div className="pt-4"><FormField type="text" name="reg_username" placeholder="Username"/></div>
                            <div className="py-4"><FormField type="password" name="reg_password" placeholder="Password"/></div>
                            <button type="submit" className="w-full py-2 text-center bg-purple-500 text-white text-sm font-bold rounded-xl">{transition.submission?<p className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="purple-500"/>Submitting...</p>:"Sign Up"}</button>
                        </Form>
                    </div>
                    :
                    <div id="login-form">
                        <Form method="post">
                            <div className="pt-4"><FormField type="text" name="log_username" placeholder="Username"/></div>
                            <div className="py-4"><FormField type="password" name="log_password" placeholder="Password"/></div>
                            <button type="submit" className="w-full py-2 text-center bg-purple-500 text-white text-sm font-bold rounded-xl">{transition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="purple-500"/>Logging in...</div>:"Log in"}</button>
                        </Form>
                    </div>
                }
            </div>
        </div>
    </main>
  )
}
