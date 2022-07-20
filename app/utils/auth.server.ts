import { json, redirect, Session } from "@remix-run/node";
import { db } from "./db.server";
import { LoginForm, SignUpForm } from "./types.server";
import bcrypt from 'bcryptjs'
import { storage } from "~/utils/session";

export const register=async (form:SignUpForm)=>{
   //this one deals with the sign up form
   //1. check that the entered email does not already exist

//    const exists=await db.users.findUnique({
//     where: {
//         email: form.email
//     }
//    });

    const exists=await db.users.findFirst({
        where: {
            email: form.email
        }
    })

   if(exists){
    return json({
        errormessage: "This email already exists! Log in instead. 👍"
    });
   }
   else if(!exists){
    //2. if non-existent, validate and add to database
    //validating
    if(form.email&&form.password){
        const emailpattern=/\S+@\S+\.\S+/;
        //bad email
        if(!emailpattern.test(form.email)){
            return(json({
                errormessage: "Kati biki bino byottaddemu? 💀💀",
                fields: {email: form.email, password: form.password},
            }));          
        }
        //short email
        else if(form.email.toString().length<5){
            return (json({
                errormessage: "Your email is too short 📧🩳",
                fields: {email: form.email, password: form.password},
            }));
        }
        //short password
        else if(form.password.toString().length<6){
            return (json({
                errormessage: "Your password is too short 🗝️🩳",
                fields: {email: form.email, password: form.password},
            }));
        }
        //if all are correct--add to database
        else{
            //bcrypt the password
            const passwordhash=await bcrypt.hash(form.password, 10);           

            const newuser=await db.users.create({
                data: {
                    email: form.email,
                    password: passwordhash
                }
            });

            if(newuser){
                // return redirect('/welcome');
                return createUserSession(newuser.id.toString(), '/welcome');
            }
            else{
                //if there was any error whilst creating the new user
                return json({
                    errormessage: "Something went wrong whilst trying to add you to our database 😢",
                    fields: {email: form.email, password: form.password}
                });
            }
        }
    }
    else if(!form.email){
        return (json({
            errormessage: "You did not provide an email 📧🫢",
            fields: {email: form.email, password: form.password},

        }));
    }
    else if(form.email&&!form.password){
        return (json({
            errormessage: "Please enter a password 🗝️🤌",
            fields: {email: form.email, password: form.password},

        }));
    }
    else if(!form.email&&form.password){
        return (json({
            errormessage: "Please enter an email 📧🤌",
            fields: {email: form.email, password: form.password},
        }));
    }
    else{
        return (json({
            errormessage: "Please enter an email and password 💀🤌",
            fields: {email: form.email, password: form.password},
        }));
    }
   }
}

export const login=async (form:LoginForm)=>{
    //login logic here
    //check if the form values exist
    if(!form.email&&form.password){
        return (json({
            errormessage: "Please enter an email 📧🤌",
            // fields: {email: form.email, password: form.password},
        }));
    }
    else if(form.email&&!form.password){
        return (json({
            errormessage: "Please enter a password 🗝️🤌",
            // fields: {email: form.email, password: form.password},
        }));
    }
    else if(!form.email&&!form.password){
        return (json({
            errormessage: "Please enter an email and password 🗝️🤌",
            // fields: {email: form.email, password: form.password},
        }));
    }
    else if(form.email&&form.password){
        //first, check that the email exists
        const user=await db.users.findUnique({
            where: {
                email: form.email
            }
        });

        //if email does not exist, return an error asking to try again or sign up
        if(!user){
            return json({
                error: "user not found",
                errormessage: "Email not found.💀 Try again or sign up."
            });
        }
        //if user exists but password is wrong
        else if(user && !await bcrypt.compare(form.password, user.password)){
            return json({
                error: "wrong password",
                errormessage: "Password is invalid.💀 Try again or click forgot password."
            });   
        }
        //if there are no errors
        else{
            return createUserSession(user.id.toString(), form.previouspage?form.previouspage:"/dashboard");
        }        
    }
}

export const createUserSession=async(userId:string, redirectTo:string)=>{
    //create a session using the user's id, and then redirect them after session has been created
    const session=await storage.getSession();
    session.set('userId', userId);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie":await storage.commitSession(session)
        }
    }); 

}

export const getUser=async function(session:Session){
    if(session.has('userId')){
        const sessionId:string=session.get('userId').toString();

        const user=await db.users.findUnique({
            where: {
                id: parseInt(sessionId)
            }
        });
        
        return user;
    }
}

export const getCeremony=async function(session:Session){
    // check if the session has the 'userId' key and get its value and set it as the sessionId
   const user=await getUser(session);

   return user?.ceremony;

}

export const endSession=async (session:Session)=>{
    return redirect('myaccount', {
        headers: {
            "Set-Cookie": await storage.destroySession(session)
        }
    })
}

export const checkIfLoggedIn=async(session:Session)=>{
    if(session.has('userId')){
        const user=await db.users.findUnique({
            where: {
                id: parseInt(session.get('userId'))
            }
        });

        if(user){return true}
    }
    else return false;
}