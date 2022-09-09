type HeadingProps={
  type: "main"|"sub"|"hero"|"mid"
  text: string
  textcolor?:string
}

function setHeading(type:"main"|"sub"|"hero"|"mid", text:string, textcolor?:string){
  switch(type){
    case 'main':
      return (
        <h1 className={`${textcolor?`text-${textcolor}`:'text-gray-600'} text-2xl font-bold capitalize`}>{text}</h1>
      );
    case 'sub':
      return (
        <h2 className={`${textcolor?`text-${textcolor}`:'text-gray-600'} text-xs font-bold uppercase`}>{text}</h2>
      );
    case 'hero':
      return (
        <h1 className="text-gray-600 text-2xl font-bold">{text}</h1>
      );
    case 'mid':
      return (
        <h1 className={`${textcolor?`text-${textcolor}`:'text-gray-600'} text-xl font-bold leading-tight`}>{text}</h1>
      );
    
  }
}

export default function Heading(props:HeadingProps) {
  return (
    <main>
      {
        setHeading(props.type, props.text, props?.textcolor)
      }
    </main>
  )
}
