type ProgressBarProps={
    progresspercentage: number
}

export default function ProgressBar(props:ProgressBarProps) {
  const percentage=`${props.progresspercentage}%`

  return (
    <main>
        <div id="outer-bar" className="mt-2 h-1 bg-red-100 rounded-full">
            <div id="inner-bar" className="h-1 bg-red-600 rounded-l-full" style={{width:percentage}}></div>
        </div>
    </main>
  )
}
