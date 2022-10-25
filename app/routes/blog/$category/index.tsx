import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react";
import BlogCategoryCard from "~/components/BlogCategoryCard";
import BrowseBlogByTopic from "~/components/BrowseBlogByTopic";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import PostCard from "~/components/PostCard";
import { blogcategories } from "~/utils/blog";
import { BlogPostCard } from "..";

// SERVER
// Loader
export const loader:LoaderFunction=async({request, params})=>{
    const slug=params.category?.toLowerCase();
    const category=(blogcategories.filter(category=>category.slug===slug))[0].category;

    const query=`
    {
        postCollection(where: {category_contains_some: "${category}"}){
          items{
            title,
            ceremony,
            summary,
            slug,
            category,
            postImage{
              url
            }
          }
        }
      }
    `

    const ctfresponse=await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({query})
      });
    
      const posts=(await ctfresponse.json()).data.postCollection.items;

      console.log(posts)

    return json({
        data: {
            slug: slug,
            posts: posts
        }
    });
}

type LoaderData={
    data: {
        slug: string,
        posts: BlogPostCard[]
    }
}

// CLIENT
export default function BlogCategoryIndex() {
    const loaderdata=useLoaderData<LoaderData>();
    const slug=loaderdata.data.slug;
    const posts=loaderdata.data.posts;

    const thiscategory=blogcategories.filter(category=>category.slug===slug);

  return (
    <main className="pt-4 w-11/12 mx-auto">
        <div><Heading type="sub" text={thiscategory[0].category}/></div>
        <div className="pt-3 text-justify"><Sentence text={thiscategory[0].summary}/></div>

        <div className="my-6 border-b border-gray-200"></div>

        <div>
            {
              posts.map(post=>{
                return (
                  <div className="py-4"><PostCard title={post.title} ceremony={post.ceremony[0]} summary={post.summary} slug={post.slug} category={post.category?post.category.toString().toLowerCase():""} url={post.postImage.url}/></div>
                )
              })
            }
        </div>

        <div><BrowseBlogByTopic thiscategory={thiscategory[0].category}/></div>

    </main>
  )
}
