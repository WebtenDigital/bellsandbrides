import { posts } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import CTA from "~/components/dashboard/CTA";
import { db } from "~/utils/db.server";
import { getAllPosts } from "~/utils/post.server";

export const loader:LoaderFunction=async function(){
  const posts=await getAllPosts();

  return json({
    data: {
      posts: posts
    }
  });
}

type LoaderData={
  data: {
    posts: posts[]
  }
}

export default function Blog() {
  const loaderdata:LoaderData=useLoaderData();

  const posts=loaderdata.data.posts;

  const [loaded, setLoaded]=useState(false);

  useEffect(()=>{
    setLoaded(document.readyState==='complete');
  },[]);

  return (
    !loaded?<div>Page is loading...</div>:<main>
        Bells Blog
        <div>
          <h2>All Posts</h2>
          {
              posts.map(post=>{
                return (
                  <div className="my-4 px-2 py-3 text-sm bg-gray-50 rounded-xl">
                    <Link to={`/blog/${post.slug}`}>
                    <p className="text-xs text-gray-400 uppercase font-semibold">{post.category}</p>
                      <h3 className="text-gray-600 font-bold">{post.title}</h3>
                      <div id="spacer" className="py-1"></div>
                      <div className="flex justify-end"><CTA type="emptywitharrow" text="Read Article" url={`/blog/${post.slug}`} bordercolor="peach"/></div>
                    </Link>
                  </div>
                )
              })
          }
        </div>
    </main>
  )
}
