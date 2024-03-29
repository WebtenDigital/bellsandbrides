import bells from '../images/bellsandbrides-line-tp.png'
import ProgressBar from './ProgressBar'

type OnboardProps={
    imageurl: string
    title: string
    subtitle: string
    step: number
    totalsteps: number
    theformstuff: JSX.Element
    step3stuff?: JSX.Element
}

export default function OnboardStep(props:OnboardProps){
    const progresspercentage=((100*props.step)/props.totalsteps);

    return(
        <main className="text-sm lg:text-base lg:flex">
            <div id="left" className='hidden lg:block lg:w-6/12'>
                {props.step!==3&&<div><img src={props.imageurl} className="min-h-screen object-cover"/></div>}
                {
                    props.step===3&&
                    <div className='hidden lg:block bg-gray-100 min-h-screen lg:pt-24'>
                        <div className=''>{props.step===3&&props.step3stuff}</div>                      
                    </div>                
                }
            </div>
            <div id="right" className="relative lg:w-6/12">
                {props.step!==3&&<div><img src={props.imageurl} className="h-56 w-full object-cover object-top lg:hidden"/>
                <div className="absolute top-48 h-10 w-full bg-white rounded-t-4xl z-20 lg:hidden"></div></div>}
                {props.step===3&&<div className='pt-4'></div>}
                {/* progress bar */}
                <div id="holder" className="w-10/12 mx-auto lg:pt-4">
                    <ProgressBar progresspercentage={progresspercentage}/>
                    <p className="pt-4 uppercase text-gray-600">Step <span className="font-bold">{props.step}</span> of <span className="font-bold">3</span></p>
                    <div>
                        <img src={bells} className="lg:w-5/12"/>
                        <h1 className='pt-4 text-2xl text-gray-700 font-black leading-tighter tracking-tight'>{props.title}</h1>
                        <p className='pt-4 pb-5 text-gray-800 lg:text-justify'>{props.subtitle}</p>
                        <div className='border-t border-gray-100'></div>
                    </div>

                    {/* only for step 3 */}
                    <div></div>
                </div>

                {/* the form stuff */}
                <div className='lg:w-10/12 lg:mx-auto'>{props.theformstuff}</div>
            </div>
        </main>
    );

}