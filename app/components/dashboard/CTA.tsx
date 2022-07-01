import { Link } from "@remix-run/react"

type CTAProps={
    type: "filled"|"empty"|"emptywitharrow"|"arrownoborder"
    url: string
    text: string
    bgcolor?: string
    bordercolor?: string
}

function setCallToAction(ctatype:"filled"|"empty"|"emptywitharrow"|"arrownoborder", url:string, text:string, bgcolor?:string, bordercolor?:string){
    switch(ctatype){
        case 'filled':
            return (
                <Link to={url} className="px-4 py-2 text-sm text-white font-medium bg-peach rounded-2xl">{text}</Link>
            )
        case 'empty':
            return (
                <Link to={url} className={`px-4 py-2 text-sm text-${bordercolor} font-medium border border-${bordercolor} border-opacity-60 rounded-2xl`}>{text}</Link>
            )
        case "emptywitharrow":
            return (
                <Link to={url} className={`px-4 py-1 flex gap-2 items-center justify-between text-sm text-peach text-${bordercolor} font-medium border border-${bordercolor} border-opacity-60 rounded-2xl`}>
                    {text}
                    <div id="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </Link>
            )
        case "arrownoborder":
            return (
                <Link to={url} className={`py-1 flex gap-2 items-center text-sm text-peach text-${bordercolor} font-medium border-opacity-60 rounded-2xl`}>
                    {text}
                    <div id="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </Link>
            )
    }
}

export default function CTA(props:CTAProps) {
  return (
    <main>
        {
            setCallToAction(props.type, props.url, props.text, props.bgcolor, props.bordercolor)
        }
    </main>
  )
}
