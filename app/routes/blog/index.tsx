import { posts } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import BlogCategoryCard from "~/components/BlogCategoryCard";
import CTA from "~/components/dashboard/CTA";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import PostCard from "~/components/PostCard";
import bannerimages from "~/utils/bannerimages";
import { blogcategories, featuredPosts } from "~/utils/blog";
import blogcategoryimages from "~/utils/blogcategoryimages";

export const loader:LoaderFunction=async function(){

  const posts=await featuredPosts();

  return json({
    data: {
      posts: posts
    }
  });
}

export type BlogPostCard={
  title: string
  ceremony: string[]
  summary: string
  slug: string
  category: string
  postImage: {
      url: string
  }
}

type LoaderData={
  data: {
    posts: BlogPostCard[]
  }
}


// CLIENT
export default function Blog() {
  const loaderdata:LoaderData=useLoaderData<LoaderData>();

  const posts=loaderdata.data.posts;

  return (
    <main>
        <div className="bg-pink-100">
          <div className="py-6 w-11/12 mx-auto">
            <Heading type="hero" text="Wedding, Introduction and Visitation Ideas"/>
            <div className="py-6"><img src={bannerimages.blogbanner} className="rounded-lg h-48 w-full object-cover"/></div>
            <div className="text-justify"><Sentence text="Find expert advice for every moment of your planning process, like how to pick a venue, write invites, how to deal with your mother-in-law  and plan a honeymoon."/></div>
          </div>
        </div>

        <section>
          <div className="py-8 w-11/12 mx-auto">
            <div className="py-4"><Heading type="sub" text="categories"/></div>
            <div id="categories" className="grid grid-cols-3 gap-x-3">
              {
                blogcategories.map(category=>{
                  return (
                    <div className="py-2"><BlogCategoryCard slug={category.slug} image={category.image} category={category.category}/></div>
                  )
                })
              }
            </div>
          </div>
        </section>

        <section className="py-8 mb-12 w-11/12 mx-auto">
          <div className="pb-4"><Heading type="sub" text="Featured"/></div>
          <div className="py-2">
            {
              posts.map(post=>{
                return (
                  <div className="py-4"><PostCard title={post.title} ceremony={post.ceremony[0]} summary={post.summary} slug={post.slug} category={post.category?post.category.toString().toLowerCase():""} url={post.postImage.url}/></div>
                )
              })
            }
          </div>
        </section>
    </main>
  )
}
