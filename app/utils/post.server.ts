import { db } from "./db.server"

export const getPost=async (slug:string)=>{
    const post=await db.posts.findUnique({
        where: {
            slug: slug
        }
    });

    return post;
}

export const getAllPosts=async function(){
    return await db.posts.findMany();
}

export const getPostsByCategory=async function(category:string){
    return await db.posts.findMany({
        where: {
            category: category.toLowerCase(),
            // featured: '1'
        },
        // fetch only three
        take: 3    
    });
}