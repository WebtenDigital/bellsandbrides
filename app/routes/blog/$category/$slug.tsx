import { posts } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import Heading from "~/components/dashboard/Heading";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS,  } from "@contentful/rich-text-types";
import { featuredPosts } from "~/utils/blog";
import PostCard from "~/components/PostCard";
import BrowseBlogByTopic from "~/components/BrowseBlogByTopic";

export const loader:LoaderFunction=async ({params})=>{
    const slug=params.slug;

    const query=`
    {
        postCollection(where: {slug_contains: "${slug}"}){
          items{
            title
            category
            featured
            postImage{
                url
              }
            summary
            ceremony
            postContent{
              json
            }
          }
        }
      }`

      const ctfresponse=await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({query})
      });

      const postdata=(await ctfresponse.json()).data.postCollection.items[0];

      const featuredposts=await featuredPosts();

    return json({
        data: {
            slug: slug,
            postdata: postdata,
            featuredpostsdata: featuredposts
        }
    })
}

type PostData={
    title: string
    category: string[]
    postImage: {
        url: string
    }
    featured: boolean
    summary: string
    ceremony: string[]
    postContent: any
    slug: string
}

type LoaderData={
    data: {
        slug: string
        postdata: PostData
        featuredpostsdata: PostData[]
    }
}

export default function Post() {
    const loaderdata:LoaderData=useLoaderData();
    const slug=loaderdata.data.slug;
    const {title, category, ceremony, featured, summary, postContent, postImage}=loaderdata.data.postdata;
    const featuredpostsdata=loaderdata.data.featuredpostsdata;

    const RICHTEXTOPTIONS={
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node:any, children:any)=>{
                return <p className="py-1 text-sm text-justify text-gray-700">{children}</p>
            },
        }
    }
    
  return (
    <main className="w-11/12 mx-auto">
        <div className="py-2"></div>
        <div><img src={postImage.url} alt={title} className="h-48 w-full object-cover shadow-xl rounded-xl"/></div>
        <div className="pt-6 pb-4">
            <div><Heading type="sub" text={category[0]}/></div>
            <div className="pt-1"><Heading type="hero" text={title}/></div>
        </div>
        <div> 
            {documentToReactComponents(postContent.json, RICHTEXTOPTIONS)}
        </div>

        <div className="my-12 border-b border-gray-200"></div>

        <section>
            <div><Heading type="sub" text="featured"/></div>
            <div className="py-4">
                {
                    featuredpostsdata.filter(post=>post.slug!==slug).map(post=>{
                        return (
                            <div><PostCard title={post.title} ceremony={post.ceremony[0]} summary={post.summary} slug={post.slug} category={post.category[0]} url={post.postImage.url}/></div>
                        )
                    })
                }
            </div>
        </section>

        <div>
            <div><BrowseBlogByTopic/></div>
        </div>
    </main>
  )
}
