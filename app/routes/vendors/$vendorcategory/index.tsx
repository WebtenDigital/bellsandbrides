import { user_vendors, vendors } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import CategoryMenu from "~/components/dashboard/CategoryMenu";
import Heading from "~/components/dashboard/Heading";
import Sentence from "~/components/dashboard/Sentence";
import Footer from "~/components/Footer";
import VendorCard from "~/components/VendorCard";
import VendorSearch from "~/components/VendorSearch";
import { checkIfLoggedIn } from "~/utils/auth.server";
import bannerimages from "~/utils/bannerimages";
import { db } from "~/utils/db.server";
import { storage } from "~/utils/session";

// SERVER
// Action
export const action:ActionFunction=async({request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  const sessionId=session.get('userId');

  const formdata=await request.formData();
  // const searchedvalue=formdata.get('search')?.toString();
  const likedstatus=formdata.get('likedstatus')?.toString();
  const vendorId=formdata.get('vendor_id')?.toString();
  const vendorCategory=formdata.get('vendor_category')?.toString();

  // add liked vendor to user_vendors
  if(likedstatus==='liked'){
      const createUserVendorJoiner=await db.user_vendors.create({
          data:{
              user_id: parseInt(sessionId),
              vendor_id: parseInt(vendorId?vendorId:""),
              vendor_category: vendorCategory
          }
      });
  }
  else if(likedstatus==='unliked'){
      const deleteVendor=await db.user_vendors.deleteMany({
          where: {
              vendor_id: parseInt(vendorId?vendorId:""),
              user_id: parseInt(sessionId)
          }
      });
  }

  return json({
      data: {
          // searchedvalue: searchedvalue,
      }
  });

}


// Loader
export const loader:LoaderFunction=async({params, request})=>{
  const session=await storage.getSession(request.headers.get('Cookie'));
  // const sessionId=parseInt(session.get('userId'));

  const category=params.vendorcategory;

  const categoryvendors=await db.vendors.findMany({
    where: {
      category: category
    }
  });

  const uservendors=await db.user_vendors.findMany();

  return json({
    data: {
      category: category,
      categoryvendors: categoryvendors,
      loggedin: await checkIfLoggedIn(session),
      uservendors: uservendors
    }
  });
}

type LoaderData={
  data: {
    category: string
    categoryvendors: vendors[]
    loggedin: boolean
    uservendors: user_vendors[]
  }
}

function setBanner(category:string){
  switch(category.toLowerCase()){
    case 'venue':
      return bannerimages.venuebanner;
    case 'cake':
      return bannerimages.cakebanner;
    default:
      return bannerimages.vendorindex;
  }
}

function setDoer(category:string){
  switch(category.toLowerCase()){
    case 'photography':
      return 'photographer';
    case 'catering':
      return 'caterer';
    case 'venue':
      return 'venue';
    case 'cake':
      return 'baker';
    case 'decor':
      return 'decorator';
    case 'musician':
      return 'musician';
    case 'dressing':
      return 'boutique';
    case 'salon':
      return 'salon';
    case 'transportation':
      return 'transporter';
    case 'mc':
      return 'MC';
    case 'ushers':
      return 'usher';
    case 'dj':
      return 'DJ';
  }
}

// CLIENT
export default function DynamicVendorCategory() {
  const loaderdata=useLoaderData<LoaderData>();
  const category=loaderdata.data.category;
  const categoryvendors=loaderdata.data.categoryvendors;
  const uservendors=loaderdata.data.uservendors;

  const uservendorsbyid=uservendors.map(vendor=>vendor.vendor_id);

  return (
    <main>
      <div id="category-specific-banner"><img src={setBanner(category.toLowerCase())} alt={`${category} banner`} className="h-48 w-full object-cover"/></div>
      <div className="bg-gray-50">
        <div className="py-6 w-11/12 mx-auto">
          <div><Heading type="main" text={category}/></div>
          <div className="py-4"><Sentence text={`We'll help you find local ${setDoer(category.toLowerCase())}s that fit your wedding budget, location, and style—all pre-screened to save you time.`}/></div>
          <div><VendorSearch/></div>
        </div>
      </div>

      {/* category vendors */}
      <section className="w-11/12 mx-auto py-10">
        <div className="pb-4">
          {/* <p className="text-sm text-gray-400 font-bold">{categoryvendors.length}</p> */}
          <Heading type="sub" text={`${categoryvendors.length} ${categoryvendors.length===1?"result":"results"}`}/>
        </div>
        {/* <div><CategoryMenu for={"Vendors"} heading={"Categories"}/></div> */}
        {
          categoryvendors.map(vendor=>{
            return (
              <div>
                <div><VendorCard currentlikedstatus={uservendorsbyid.includes(vendor.id)?"liked":"unliked"} vendorId={vendor.id} vendorname={vendor.vendor_name?vendor.vendor_name:""} category={vendor.category?vendor.category:""} baseprice={vendor.base_price?vendor.base_price:0} slug={vendor.slug?vendor.slug:""} loggedin={loaderdata.data.loggedin}/></div>
              </div>
            )
          })
        }        
      </section>

      <footer><Footer/></footer>
    </main>
  )
}
