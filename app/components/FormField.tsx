import { useState } from "react"
import Label from "./Label"

type FormFieldProps={
    type: string
    name: string
    id?: string
    placeholder?: string
    required?: boolean
    pattern?: string
    className?: string
    value?: string
    minLength?: string
    handleOnChange?: (event:{target:HTMLInputElement})=>void
    checked?: boolean
}

export default function FormField(props:FormFieldProps){
    const [showpassword, setShowPassword]=useState(false);
    const [inputtype, setInputType]=useState('password');

    return (
        <div className="relative">            
            {props.type==="password"?
            <div>
                <input value={props.value} type={inputtype} name={props.name} placeholder={props.placeholder} required={props.required} pattern={props.pattern} className={"pl-2 py-2 w-full text-sm border border-gray-300 rounded-xl focus:outline-none focus:invalid:border-red-400 focus:invalid:bg-red-50 "+ props.className}/>
                {!showpassword&&<button onClick={()=>{setShowPassword(prevstate=>prevstate=!prevstate); setInputType('text');}}><svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-2 h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg></button>}
                {showpassword&&<button onClick={()=>{setShowPassword(prevstate=>prevstate=!prevstate); setInputType('password');}}><svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-2 h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg></button>}       
            </div>
            :
            <input onChange={props.handleOnChange} value={props.value} type={props.type} name={props.name} placeholder={props.placeholder} required={props.required===false?false:true} pattern={props.pattern} className={"pl-2 py-2 w-full text-sm border border-gray-300 rounded-xl focus:outline-none focus:invalid:border-red-400 focus:invalid:bg-red-50 "+ props.className}/>
            }
        </div>

    )
}