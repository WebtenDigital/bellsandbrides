import { Form } from "@remix-run/react"
import { useState } from "react";

type UploadProps={
    name: string
    dbimageurl: string
}

export default function UploadImage(props:UploadProps) {
    const [previewsource, setPreviewSource]=useState(props.dbimageurl);

    function previewFile(file:Blob){
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            if(reader.result){
                setPreviewSource(reader.result.toString());
            }
        }
    }

  return (
    <main className="w-full">
        <div>
            <div className="my-4">
                <div className="my-2 py-3 px-2 border-2 border-gray-200 border-dashed rounded-xl hover:cursor-pointer">
                    {
                        previewsource
                        ?
                        <div>
                            <div>
                                <img src={previewsource} className="opacity-60"/>
                            </div>
                            <input type="hidden" name={props.name} value={previewsource}/>
                        </div>
                        :
                        <label htmlFor={props.name} className="hover:cursor-pointer">
                            <div>
                                <div className="flex justify-center"><svg aria-hidden="true" className="mb-3 w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg></div>
                                <p className="text-center text-sm text-gray-400">Click here to add image</p>
                            </div>
                            <input id={props.name} type="file" className="hidden" onChange={(event)=>{previewFile(event.target.files?event.target.files[0]:new Blob())}}/>                                
                        </label>
                    }
                </div>
                {
                    previewsource&&
                    <div className="flex items-center justify-between">
                        <button type="button" className="py-1 px-2 text-sm border border-purple-500 text-purple-500 rounded-xl" onClick={()=>{setPreviewSource("")}}>Change</button>
                        <Form method="post">
                            <input type="hidden" name="to_delete" value={props.name}/>
                            <button type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-peach">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </Form>
                    </div>
                }
            </div>
        </div>
    </main>
  )
}
