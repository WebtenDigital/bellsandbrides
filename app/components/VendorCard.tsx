import dashimages from "~/utils/dashimages";
import CTAButton from "./dashboard/CTAButton";
import Spacer from "./Spacer";

type VendorProps={
    vendorname: string
    category: string
    baseprice: number
}

export default function VendorCard(props:VendorProps) {
  return (
    <main>
        <div className="flex items-center gap-3 text-sm">
            <div id="left-side-image" className="w-5/12"><img src={dashimages.photography} className="rounded-2xl"/></div>
            <div id="right-side" className="w-7/12">
                <h2 className="text-gray-600 text-base font-bold">{props.vendorname}</h2>
                <div>{props.category}<span className="text-lg">&middot;</span>Kampala</div>
                <p>{props.baseprice}</p>
                <div><CTAButton type="emptywitharrow" text="Inquire" bordercolor="peach"/></div>
            </div>
        </div>
        <Spacer gapsize="2"/>
    </main>
  )
}
