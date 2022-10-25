import { LoaderFunction, redirect } from "@remix-run/node";

export const loader:LoaderFunction=async()=>{
    return redirect("https://www.youtube.com/channel/UCbbcotg6LPE6YC_Bag80xsg");
}

export default function Stories() {
  return (
    <div>stories</div>
  )
}
