type SeparatorProps={
    bordercolor: string
    gapsize?: string
}

export default function Separator(props:SeparatorProps) {
  return (
    <main>
        <div className={`border-t border-${props.bordercolor}`}></div>
    </main>
  )
}
