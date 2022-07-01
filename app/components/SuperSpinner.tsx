type SpinnerProps={
    innercolor: string
    outercolor: string
}

export default function SuperSpinner(props:SpinnerProps) {
  return (
    <main className="inline-block">
        <div className={`h-6 w-6 bg-${props.outercolor} rounded-full animate-spin`}>
            <div className={`h-5 w-5 bg-${props.innercolor} rounded-full`}></div>
        </div>
    </main>
  )
}
