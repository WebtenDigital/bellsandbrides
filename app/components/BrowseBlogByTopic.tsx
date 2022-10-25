import { Link } from "@remix-run/react"
import { blogcategories } from "~/utils/blog"
import BlogCategoryCard from "./BlogCategoryCard"
import Heading from "./dashboard/Heading"

type ByTopicProps={
    thiscategory?: string
}
export default function BrowseBlogByTopic(props:ByTopicProps) {
  return (
    <div>
        <div className="py-8">
            <div><Heading type="sub" text="Browse By Topic"/></div>
            <div className="py-4 grid grid-cols-3 gap-x-3">
                {
                    blogcategories.filter(category=>category.category!==props.thiscategory).slice(1,4).map(category=>{
                        return (
                            <div><BlogCategoryCard slug={category.slug} image={category.image} category={category.category}/></div>
                        )
                    })
                }
            </div>

            <div className="flex justify-end "><div className="text-peach text-sm border-b border-peach"><Link to={`/blog#categories`}>See All</Link></div></div>
        </div>
    </div>
  )
}
