import CTA from "~/components/dashboard/CTA"
import Heading from "~/components/dashboard/Heading"
import Sentence from "~/components/dashboard/Sentence"
import ProgressBar from "~/components/ProgressBar"
import bannerimages from "~/utils/bannerimages"

export default function StepThree() {
  return (
    <main>
        <div>
            <div ><img src={bannerimages.vendorindex} alt={`step-two`} className="h-64 w-full object-cover"/></div>
            <div className='py-8 relative -mt-10 bg-white rounded-t-4xl z-10'>
            <div className='w-10/12 mx-auto'>
                <div><ProgressBar progresspercentage={100}/></div>
                <p className='py-4 text-gray-600 text-xs uppercase'>Step <span className='font-bold'>3</span> Of <span className='font-bold'>3</span></p>
                <div className=''><Heading type="hero" text={`Thank You For Submitting`}/></div>
                <div className='my-4 border-b border-gray-200'></div>
                {/* step body here */}
                <div>
                    <Sentence text="Our team will review the information and reach out to you regarding the next steps."/>
                    <div className='pt-8 flex justify-between items-center'>
                    <CTA type="fillednoarrow" text="Other Vendors" url="/vendors"/>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </main>
  )
}
