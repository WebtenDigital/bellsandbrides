import bells from '../images/bellsandbrides-line-tp.png'
import ProgressBar from './ProgressBar'

type OnboardProps={
    imageurl: string
    title: string
    subtitle: string
    step: number
    totalsteps: number
}

export default function OnboardStep(props:OnboardProps){
    const progresspercentage=((100*props.step)/props.totalsteps);

    return(
        <main className="text-sm">
            <div className="relative">
                {props.step!==4&&<div><img src={props.imageurl} className="h-56 w-full object-cover object-top"/>
                <div className="absolute top-48 h-10 w-full bg-white rounded-t-3xl z-20"></div></div>}
                {props.step===4&&<div className='pt-4'></div>}
                {/* progress bar */}
                <div id="holder" className="w-10/12 mx-auto">
                    <ProgressBar progresspercentage={progresspercentage}/>
                    <p className="pt-4 uppercase text-gray-600">Step <span className="font-bold">{props.step}</span> of <span className="font-bold">4</span></p>
                    <div>
                        <img src={bells}/>
                        <h1 className='pt-4 text-2xl text-gray-700 font-black leading-tighter tracking-tight'>{props.title}</h1>
                        <p className='pt-4 pb-5 text-gray-800'>{props.subtitle}</p>
                        <div className='border-t border-gray-100'></div>
                    </div>
                </div>
            </div>
        </main>
    );

}