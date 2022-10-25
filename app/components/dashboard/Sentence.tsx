type SentenceProps={
    text: string
    className?: string
}

export default function Sentence(props:SentenceProps) {
  return (
    <p className={`text-gray-600 text-sm tracking-tight lg:text-base `+ props.className }>{props.text}</p>
  )
}
