import { posts } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import Heading from "~/components/dashboard/Heading";
import { getPost } from "~/utils/post.server";

export const loader:LoaderFunction=async ({params})=>{
    const slug=params.slug;

    // get the post associated with this slug
    if(slug){
        const post=await getPost(slug);

        return json({
            data: {
                slug: slug,
                post:post
            }
        })
    }
}

type LoaderData={
    data: {
        slug: string
        post: posts
    }
}

export default function Post() {
    const loaderdata:LoaderData=useLoaderData();
    const post=loaderdata.data.post;
  return (
    <main className="w-11/12 mx-auto">
        <div className="py-2"></div>
        <Heading type="main" text={post.title?post.title:""}/>
    </main>
  )
}
