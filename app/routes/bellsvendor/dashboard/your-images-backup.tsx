import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import cloudinary from "~/utils/cloud.server";
import slugify from 'slugify'

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
    const formdata=await request.formData();
    const vendorname=formdata.get('vendor_name')?.toString();
    const vendorslug=slugify(vendorname?vendorname:"");
    const mainimagepreviewsource=formdata.get("main-image-preview-source")?.toString();

    if(mainimagepreviewsource){
        cloudinary.uploader.upload(mainimagepreviewsource, {
            folder: vendorname //this is the vendor's name
        }).then((result)=>{
            // console.log(JSON.stringify(result));
            console.log(result.url);

            // now here, we send the url to the vendor's database
        }).catch(error=>{
            console.log(error)
        })
    }

    return json({
        data: {

        }
    });
}


export default function YourImages() {
    // generate a preview from the file; then send the base64encoded url to cloudinary up in action
    const [previewsource, setPreviewSource]=useState();

    if(previewsource){console.log(previewsource)};

    // preview file
    function previewFile(file:Blob){
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            if(reader.result){
                setPreviewSource(reader.result);
            }
        }
    }

  return (
    <main>
        <div>
            <Form method="post" encType="multipart/form-data">
                <div>
                    <p>Main Photo</p>
                    <input type="text" name="vendor_name" placeholder="Business Name" className="border border-gray-200"/>
                    <input type="file" className="border-gray-200" onChange={(event)=>{previewFile(event.target.files[0])}}/>
                    <input type="hidden" name="main-image-preview-source" value={previewsource}/>
                    <div className="pt-10"><button type="submit" className="px-6 py-1 text-sm text-white bg-peach rounded-xl">Submit</button></div>
                </div>                
            </Form>
            <div>
                <p>Preview</p>
                {
                    previewsource&& <div><img src={previewsource} alt="chosen"/></div>
                }
            </div>
        </div>
    </main>
  )
}
