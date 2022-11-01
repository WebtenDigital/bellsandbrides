import { useTransition } from "@remix-run/react"
import { ActionSubmission, LoaderSubmission, Transition } from "@remix-run/react/transition"
import SuperSpinner from "./SuperSpinner"

type SubmitProps={
    defaulttext: string
    transitiontext: string
    submission: ActionSubmission | LoaderSubmission | undefined
}
export default function Submit(props:SubmitProps) {
  return (
    <button type="submit" className="px-4 py-2 text-sm text-white font-medium bg-peach rounded-2xl lg:text-base">{props.submission?
      <div className='flex items-center gap-4 font-semibold'>
        <SuperSpinner outercolor="white" innercolor="peach"/>
        <p>{props.transitiontext}</p>
      </div>
      :
      <p>{props.defaulttext}</p>}
    </button>

  )
}
