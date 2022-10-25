import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useActionData } from "@remix-run/react";
import FormField from "~/components/FormField";
import SuperSpinner from "~/components/SuperSpinner";
import bellsadmin from '../../images/others/bells-admin.png'
import { useTransition } from "@remix-run/react";
import { adminsessionstorage } from "~/utils/session";

// Action
export const action:ActionFunction=async({request})=>{
  const formdata=await request.formData();
  const username=formdata.get("user_name");
  const password=formdata.get("user_password");

  if(username&&password){
    // check against credentials
    if(username!==process.env.ADMIN_USERNAME){
      return json({
        data: {
          errormessage:"Wrong Username! Naye ggwe ddala oli admin???"
        }
      });
    }
    else if(password!==process.env.ADMIN_PASSWORD){
      return json({
        data: {
          errormessage:"Wrong Password! Guy wetereeze man!!!"
        }
      });
    }
    else if(username===process.env.ADMIN_USERNAME&&password===process.env.ADMIN_PASSWORD){
      // generate session from thin air and set values to monitor the session
      const session=await adminsessionstorage.getSession();
      session.set("admin_pwd", password);

      // redirect and start an admin session
      return redirect('/admin/dashboard', {
        headers: {
          "Set-Cookie": await adminsessionstorage.commitSession(session)
        }
      });
    }
  }

    return null;
}

type ActionData={
  data: {
    errormessage: string
  }
}

// CLIENT
export default function AdminLogin() {
  const transition=useTransition();
  const actiondata=(useActionData<ActionData>())?.data;

  return (
    <main className="py-6 w-10/12 mx-auto">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="h-7 w-7 pt-0.5 pl-1 bg-peach bg-opacity-20 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-peach" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <p className="text-center text-xl text-gray-700 font-bold">Login</p>
            </div>
            <Link to="/admin" className="w-6/12 -mt-2">
                <img src={bellsadmin}/>
            </Link>
        </div>
        <p className="pt-4 text-gray-500 text-sm">Log into your Admin account</p> 

        <div className="py-8">
          <Form method="post">
                <FormField 
                    type="text"
                    name="user_name"
                    placeholder="username"
                    required={true}
                    minLength="4"
                />

                <div className="py-2"></div>
                
                <FormField
                    type="password"
                    name="user_password"
                    placeholder="password"
                    required={true}
                    minLength="6"
                />

                {/* error feedback */}
                <div className="py-4">
                  <div></div>
                  <p className="text-sm text-red-500 italic">{actiondata?.errormessage}</p>
                </div>

              <div className="pt-8"><button type="submit" className="w-full py-2 text-center bg-peach text-white text-sm font-bold rounded-xl">{transition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="peach"/>Logging in...</div>:"Log in"}</button></div>
          </Form>
        </div>
    </main>
  )
}
