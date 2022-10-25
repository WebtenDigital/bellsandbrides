import blogcategoryimages from "./blogcategoryimages"

export type BlogCategory={
    category: string
    image: string
    slug: string
    summary: string
  }
  
  export const blogcategories:BlogCategory[]=[
    {
      category: "Wedding Services",
      image: blogcategoryimages.weddingservices,
      slug: "wedding-services",
      summary: ""
    },
    {
      category: "Planning Advice",
      image: blogcategoryimages.planningadvice,
      slug: "planning-advice",
      summary: ""
    },
    {
      category: "Visitation Ceremony",
      image: blogcategoryimages.weddingceremony,
      slug: "visitation-ceremony",
      summary: ""
    },
    {
      category: "Introduction Ceremony",
      image: blogcategoryimages.weddingceremony,
      slug: "introduction-ceremony",
      summary: "Your introduction ceremony is your big moment to officially introduce your spouse to the world. There are several traditions for different cultures, procedures and a checklist of best practices to make sure you have the best ceremony possible. Find advice here about how to make this happen."
    },
    {
      category: "Wedding Ceremony",
      image: blogcategoryimages.weddingceremony,
      slug: "wedding-ceremony",
      summary: ""
    },
    {
      category: "Wedding Fashion",
      image: blogcategoryimages.weddingfashion,
      slug: "wedding-fashion",
      summary: ""
    },
    {
      category: "Destination Weddings",
      image: blogcategoryimages.destinationweddings,
      slug: "destination-weddings",
      summary: ""
    },
    {
      category: "Family and Friends",
      image: blogcategoryimages.marriedlife,
      slug: "family-and-friends",
      summary: ""
    },
    {
      category: "Events and Parties",
      image: blogcategoryimages.eventsandparties,
      slug: "events-and-parties",
      summary: ""
    },
    {
      category: "Wedding Reception",
      image: blogcategoryimages.weddingreception,
      slug: "wedding-reception",
      summary: ""
    },
    {
      category: "Married Life",
      image: blogcategoryimages.marriedlife,
      slug: "married-life",
      summary: ""
    },
    {
      category: "Health and Beauty",
      image: blogcategoryimages.healthbeauty,
      slug: "health-and-beauty",
      summary: ""
    }
  ];

// COMMON QUERIES

//  Featured Posts
export async function featuredPosts(){
    const query=`
    {
        postCollection(where: {featured: true}){
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
      }`;

    const featuredpostsresponse=await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({query})
      });

    // console.log(await featuredpostsresponse.json())
    
    return (await featuredpostsresponse.json()).data.postCollection.items;
}