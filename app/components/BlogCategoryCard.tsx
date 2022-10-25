import { Link } from "@remix-run/react"

type BlogCategoryCardProps={
    slug: string
    image: string
    category: string
}

export default function BlogCategoryCard(props:BlogCategoryCardProps) {
  return (
    <div>
    <Link to={`/blog/${props.slug}`}>
      <div className="p-3 bg-[#F1B2D8] rounded-3xl shadow-lg"><img src={props.image} alt={props.category} className="h-20 w-full object-cover"/></div>
      <div><p className="py-2 text-center text-xs text-gray-400 font-bold leading-tighter tracking-tighter">{props.category}</p></div>
    </Link>
  </div>
  )
}
