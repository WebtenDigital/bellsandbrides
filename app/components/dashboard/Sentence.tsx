type SentenceProps={
    text: string
    className?: string
}

export default function Sentence(props:SentenceProps) {
  return (
    <h1 className={`text-gray-600 text-sm tracking-tight `+ props.className }>{props.text}</h1>
  )
}
