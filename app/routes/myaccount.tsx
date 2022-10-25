import { ActionFunction, json, LoaderFunction} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import FormField from "~/components/FormField";
import SuperSpinner from "~/components/SuperSpinner";
import { login, register } from "~/utils/auth.server";
import bells from '../images/bellsandbrides-line-tp.png'

//SERVER
// Action
export const action:ActionFunction=async ({request})=>{
    const formdata=await request.formData();
    const email=formdata.get("user_email")?.toString();
    const password=formdata.get("user_password")?.toString();
    const formtype=formdata.get("formType")?.toString();
    const previouspage=formdata.get('previous_page')?.toString();

    //if form type is signup, validate, authenticate and add data to database, create session cookie, then redirect
    if(formtype==="register"){
        const user=await register({email: email, password:password}); //register returns json(error, message, submission_status) when error, and simply redirects to /welcome if no errors
        //if user fails to get created for some reason
        if(user){
            return user;
        }
        else return null;
        }

    //if form type is login, validate that the user exists, compare the password and then create session cookie, then redirect
    else if(formtype==='login'){
        const logindata=await login({
            email: email, 
            password: password,
            previouspage: previouspage
        }); //login returns json(error, message, submission_status) when error, and simply redirects to /dashboard if no errors
        if(logindata){
            return logindata;
        }
        else return null;
    }
    }

// Loader
export const loader:LoaderFunction=({request})=>{
    const url=new URL(request.url);
    const previouspage=url.searchParams.get('from')
    const formtype=url.searchParams.get("type");

    return json({
        data:{
            previouspage: previouspage===null?'dashboard':previouspage,
            formtype: formtype?'register':"login"

        }
    })
}


type ActionData={
    errormessage: string
    fields?: {email:string, password:string}
}

type LoaderData={
    data: {
        previouspage: string
        formtype: string
    }
}


//CLIENT
export default function MyAccount() {
    const actiondata:ActionData|undefined=useActionData();

    const loaderdata=useLoaderData<LoaderData>();

    const transition=useTransition();
    
    const [formstate, setFormState]=useState(loaderdata.data.formtype==='register'?'register':'login');
    

  return (
    <main className="lg:bg-gray-50 lg:min-h-screen lg:pt-8">
        <div className="w-10/12 mx-auto pt-8 lg:w-4/12 lg:py-10 lg:px-10 lg:bg-white lg:rounded-xl">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="h-7 w-7 pt-0.5 pl-1 bg-peach bg-opacity-20 rounded-full">
                        {formstate==="register"?<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-peach" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>:
                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-peach" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                        </svg>}
                    </div>
                    <p className="text-center text-xl text-gray-700 font-bold">{formstate==='register'?"Sign Up":"Login"}</p>
                </div>
                <Link to="/" className="w-6/12 -mt-2">
                    <img src={bells}/>
                </Link>
            </div>
            
            {
                formstate==='register'?
                <p className="pt-4 text-gray-500 text-sm">Sign up here to begin your introduction and wedding journey</p>
                :
                <p className="pt-4 text-gray-500 text-sm">Log in to your Bells and Brides account</p>                  
            }

            {/* error messages */}
            <div className="py-4">
                <div></div>
                <p className="text-sm text-red-500">{actiondata?.errormessage}</p>
            </div>

            <Form method="post" noValidate>
                <input type="hidden" name="previous_page" value={`/${loaderdata.data.previouspage}`}/>

                <FormField
                    type="hidden"                
                    name="formType"
                    value={formstate}
                />

                <FormField 
                    type="email"
                    name="user_email"
                    placeholder="email"
                    required={true}
                    pattern="\S+@\S+\.\S+"
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

                {
                    formstate==='register'?
                        <p className="py-6 text-sm text-gray-500">By signing up, you agree to the <Link to="/terms/terms-of-service" className="text-peach italic">Terms of Service</Link> and <Link to="/terms/privacy" className="text-peach italic">Privacy Policy</Link>, including <Link to="terms/cookies" className="text-peach italic">Cookie Use.</Link></p>
                        :
                        <p className="py-4"></p>
                }
                {/* <div className=""><SuperSpinner outercolor="peach" innercolor="white"/></div> */}
                
                <button type="submit" className="w-full py-2 text-center bg-peach text-white text-sm font-bold rounded-xl">{formstate==='register'?(transition.submission?<p className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="peach"/>Submitting...</p>:"Sign Up"):(transition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="peach"/>Logging in...</div>:"Log in")}</button>

                {formstate==="login"?
                <div className="pt-2 flex justify-center"><button className="text-center text-sm italic text-gray-600">Forgot password?</button></div>
                :
                ""}

                {formstate==="register"?
                <div>
                    <p className="pt-8 text-center text-sm text-gray-700">Already have an account? <button type="button" className="text-peach font-bold" onClick={()=>{setFormState('login')}}
                    >Log in</button></p>
                </div>
                :
                <div>
                    <p className="pt-8 text-center text-sm text-gray-700">Don't have an account yet? <button type="button" className="text-peach font-bold" onClick={()=>{setFormState('register')}}
                    >Sign up</button></p>
                </div>                
                }
            </Form>
        </div>
    </main>
  )
}
