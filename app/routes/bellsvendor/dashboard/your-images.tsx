import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import { db } from "~/utils/db.server";
import { vendorsessionstorage } from "~/utils/session";
import cloudinary from "~/utils/cloud.server";
import SuperSpinner from "~/components/SuperSpinner";
import { vendors } from "@prisma/client";
import UploadImage from "~/components/UploadImage";


// Action
export const action:ActionFunction=async({request})=>{
  const session=await vendorsessionstorage.getSession(request.headers.get("Cookie"));
  const vendorid=parseInt(session.get("vendor_id").toString());

  // check if a main image was already set and send the link down to the client
  const thisvendor=await db.vendors.findUnique({
    where: {
      id: vendorid
    }
  });

  const vendorname=thisvendor?.vendor_name;

  const formdata=await request.formData();
  const coverimagepreviewsource=formdata.get("cover_image_url")?.toString();

  const imageonepreviewsource=formdata.get("image_one")?.toString();
  const imagetwopreviewsource=formdata.get("image_two")?.toString();
  const imagethreepreviewsource=formdata.get("image_three")?.toString();
  const imagefourpreviewsource=formdata.get("image_four")?.toString();
  const imagefivepreviewsource=formdata.get("image_five")?.toString();


  // send to Cloudinary
  async function uploadToCloudinary(previewsource:string, foldername:string){
    // upload to cloudinary
    if(previewsource){
      const result=await cloudinary.uploader.upload(previewsource, {
        folder: foldername
      });

      return result.url;
    }
    else return null;
  }

  const folder=vendorname?vendorname:"Unnamed Vendor";

  if(coverimagepreviewsource){
    const result=await cloudinary.uploader.upload(coverimagepreviewsource, {
      folder: vendorname?vendorname:"Unnamed Vendor"
    });
    
    // receive url from Cloudinary and store it in the db
    // error_handling
    const coverimageurl=result.url;

    const updatecoverimage=await db.vendors.update({
      where: {
        id: vendorid
      },
      data: {
        cover_image: coverimageurl
      }
    });

    return redirect("/bellsvendor/dashboard/your-images");
  }


  // upload to db
  // image one
  if(imageonepreviewsource){
    const updateimageone=await db.vendors.update({
      where: {
        id: vendorid
      },
      data: {
        image_one: await uploadToCloudinary(imageonepreviewsource?imageonepreviewsource:"", folder)
      }
    });
  }

  // image two
  if(imagetwopreviewsource){
    const updateimagetwo=await db.vendors.update({
      where: {
        id: vendorid
      },
      data: {
        image_two: await uploadToCloudinary(imagetwopreviewsource?imagetwopreviewsource:"", folder)
      }
    });
  }

  // image three
  if(imagethreepreviewsource){
    const updateimagethree=await db.vendors.update({
      where: {
        id: vendorid
      },
      data: {
        image_three: await uploadToCloudinary(imagethreepreviewsource?imagethreepreviewsource:"", folder)
      }
    });
  }

  // image four
  if(imagefourpreviewsource){
    const updateimagefour=await db.vendors.update({
      where: {
        id: vendorid
      },
      data: {
        image_four: await uploadToCloudinary(imagefourpreviewsource?imagefourpreviewsource:"", folder)
      }
    });
  }

  // image five
  if(imagefivepreviewsource){
    const updateimagefive=await db.vendors.update({
      where: {
        id: vendorid
      },
      data: {
        image_four: await uploadToCloudinary(imagefivepreviewsource?imagefivepreviewsource:"", folder)
      }
    });
  }

  // delete binned images
  const imagetodelete=formdata.get("to_delete")?.toString();

  if(imagetodelete?.toLowerCase()==='image_one'){
    const deleteimagefromdb=await db.vendors.update({
      where: {
        id: vendorid
      },
      data:{
        image_one: ""
      }
    });
  }
  else if(imagetodelete?.toLowerCase()==='image_two'){
    const deleteimagefromdb=await db.vendors.update({
      where: {
        id: vendorid
      },
      data:{
        image_two: ""
      }
    });
  }
  else if(imagetodelete?.toLowerCase()==='image_three'){
    const deleteimagefromdb=await db.vendors.update({
      where: {
        id: vendorid
      },
      data:{
        image_three: ""
      }
    });
  }
  else if(imagetodelete?.toLowerCase()==='image_four'){
    const deleteimagefromdb=await db.vendors.update({
      where: {
        id: vendorid
      },
      data:{
        image_four: ""
      }
    });
  }
  else if(imagetodelete?.toLowerCase()==='image_five'){
    const deleteimagefromdb=await db.vendors.update({
      where: {
        id: vendorid
      },
      data:{
        image_five: ""
      }
    });
  }

  return null;
}


// Loader
export const loader:LoaderFunction=async({request})=>{
  const session=await vendorsessionstorage.getSession(request.headers.get("Cookie"));
  const vendorid=parseInt(session.get("vendor_id").toString());

  // check if a main image was already set and send the link down to the client
  const thisvendor=await db.vendors.findUnique({
    where: {
      id: vendorid
    }
  });

  return json({
    data: {
      thisvendor: thisvendor
    }
  });
}

type LoaderData={
  data: {
    thisvendor: vendors
  }
}

export default function YourImages() {
  const loaderdata=useLoaderData<LoaderData>().data;
  // const [showselectionbox, setShowSelectionBox]=useState(false);
  const thisvendor=loaderdata.thisvendor;
  const [previewsource, setPreviewSource]=useState(thisvendor.cover_image);

  function previewFile(file:Blob){
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      if(reader.result){
        setPreviewSource(reader.result?.toString());
      }
    }    
  }
  
  const coverimagetransition=useTransition();
  const otherimagetransition=useTransition();

  const otherimages=[
    {
      name: "image_one",
      dbimageurl: thisvendor.image_one
    },
    {
      name: "image_two",
      dbimageurl: thisvendor.image_two
    },
    {
      name: "image_three",
      dbimageurl: thisvendor.image_three
    },
    {
      name: "image_four",
      dbimageurl: thisvendor.image_four
    },
    {
      name: "image_five",
      dbimageurl: thisvendor.image_five
    }
  ]


  return (
    <main>
      <div className="w-11/12 mx-auto pt-8">
        <div><Heading type="main" text="Your Images"/></div>
        <div className="py-2"><Sentence text="These photos will be displayed on your vendor profile."/></div>

          {/* {!showselectionbox&&<div className="flex justify-end">
            <button onClick={()=>{setShowSelectionBox(prevstate=>prevstate=!prevstate)}} className="px-3 py-2 text-sm text-white bg-purple-600 rounded-xl hover:cursor-pointer">Add Image</button>
          </div>} */}

          <Form method="post">
            <div className="py-4">
              <div className="py-2"><Heading type="sub" text="cover image"/></div>
              <div className="py-8 border-2 border-gray-200 border-dashed rounded-xl hover:cursor-pointer">
                {previewsource?
                <div className="px-2 py-2"><img src={previewsource} alt="cover" className="opacity-60"/></div>
                :
                <label htmlFor="file_input" className="hover:cursor-pointer">
                  <div>
                    <div className="flex justify-center"><svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg></div>
                    <p className="text-center text-sm text-gray-400">Click here to add cover image</p>
                  </div>
                  <input id="file_input" type="file" onChange={(event)=>{previewFile(event.currentTarget.files?event.currentTarget.files[0]:new Blob)}} className="hidden"/>
                </label>              
                }
              </div>

              {previewsource&&<div className="pt-4 flex items-center justify-between">
                <input type="hidden" name="cover_image_url" value={previewsource}/>
                <div><button type="button" onClick={()=>{setPreviewSource("")}} className="px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-xl">Change</button></div>
                <div><button type="submit" className="w-full py-2 px-3 text-center bg-purple-500 text-white text-sm font-bold rounded-xl">{coverimagetransition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="purple-500"/>Setting...</div>:"Set Cover Photo"}</button></div>
              </div>}
            </div>
          </Form>

          <div className="pt-10"><Heading type="sub" text="Other Images"/></div>
            <Form method="post">
              <div className="grid grid-cols-2 gap-x-3">
                {
                  otherimages.map(image=>{
                    return (
                      <div><UploadImage name={image.name} dbimageurl={image.dbimageurl?image.dbimageurl:""}/></div>
                    )
                  })
                }
              </div>
              <div className="py-4"><button type="submit" className="w-full py-2 px-3 text-center bg-purple-500 text-white text-sm font-bold rounded-xl">{otherimagetransition.submission?<div className="flex justify-center gap-4 font-semibold"><SuperSpinner outercolor="white" innercolor="purple-500"/>Adding...</div>:"Add Photos"}</button></div>
            </Form>
      </div>
    </main>
  )
}
