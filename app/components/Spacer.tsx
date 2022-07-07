type SpacerProps={
    gapsize: string
}

export default function Spacer(props:SpacerProps) {
  return (
    <div className={`py-${props.gapsize}`}></div>
    // <div className="py-8"></div>
  )
}