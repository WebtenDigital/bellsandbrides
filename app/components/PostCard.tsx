import { Link } from "@remix-run/react"
import slugify from "slugify"
import Heading from "./dashboard/Heading"
import Sentence from "./dashboard/Sentence"

type BlogPostCard={
  title: string
  ceremony: string
  summary: string
  slug: string
  category: string
  url: string
}

export default function PostCard(props:BlogPostCard) {
  return (
    <main>
      <div className="w-11/12">
          <Link to={`/blog/${slugify(props.category)}/${props.slug}`}>
              {
                <div className="">
                  <div><img src={props.url} alt={props.title} className="h-32 w-full object-cover rounded-2xl shadow-lg"/></div>
                  <div className="my-2 bg-gray-50 rounded-2xl shadow-lg">
                    <div className="w-11/12 mx-auto py-3 ">
                      <p className="text-rt text-gray-400 font-semibold uppercase">{props.ceremony}</p>
                      <div className="py-1"><Heading type="small" text={props.title}/></div>
                      <div className="py-1 text-justify"><Sentence text={props.summary}/></div>
                    </div>
                  </div>
                </div>
              }
          </Link>
        </div>
    </main>
    
  )
}
