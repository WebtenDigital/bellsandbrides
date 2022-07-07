type HeadingProps={
  type: "main"|"sub"
  text: string
}

function setHeading(type:"main"|"sub", text:string){
  switch(type){
    case 'main':
      return (
        <h1 className="text-gray-600 text-2xl font-bold capitalize">{text}</h1>
      )
    case 'sub':
      return (
        <h2 className="text-gray-600 text-xs font-bold uppercase">{text}</h2>
      )
  }
}

export default function Heading(props:HeadingProps) {
  return (
    <main>
      {
        setHeading(props.type, props.text)
      }
    </main>
  )
}
