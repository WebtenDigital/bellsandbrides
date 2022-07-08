type LabelProps={
    for: string
    text: string
}

export default function Label(props:LabelProps) {
  return (
    <label htmlFor={props.for} className="pl-1 text-xs text-gray-500 font-bold uppercase">{props.text}</label>
  )
}
