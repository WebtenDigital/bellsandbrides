import { vendors, vendor_categories } from '@prisma/client';
import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react';
import Heading from '~/components/dashboard/Heading'
import Spacer from '~/components/Spacer';
import VendorCard from '~/components/VendorCard';
import { db } from '~/utils/db.server';
// SERVER
export const loader:LoaderFunction=async ({request})=>{
    const url=new URL(request.url);
    const term=url.searchParams.get('category');

    // find category ID for the category param
    const category=await db.vendor_categories.findUnique({
        where: {
            category: term?term:""
        }
    });

    const categoryId=category?.id;

    const categoryVendors=await db.vendors.findMany({
        where: {
            category_id: categoryId
        }
    });

    // all vendors
    const allVendors=await db.vendors.findMany();

    // all categories
    const allCategories=await db.vendor_categories.findMany();

    return {
        data: {
            searchterm:term,
            categoryId: categoryId,
            categoryVendors: categoryVendors,
            allVendors: allVendors,
            allCategories: allCategories
        }
    };
}

type LoaderData={
    data: {
        searchterm: string
        categoryId: number
        categoryVendors: vendors[]
        allVendors: vendors[]
        allCategories: vendor_categories[]
    }
}

// CLIENT
export default function VendorIndex() {
    const loaderdata=useLoaderData<LoaderData>();
    const categoryVendors=loaderdata.data.categoryVendors;
    const allVendors=loaderdata.data.allVendors;
    const allCategories=loaderdata.data.allCategories;

  return (
    <main>
        {loaderdata.data.searchterm?<section id="category-vendors">
            <Spacer gapsize='2'/>
            <Heading type='main' text={`${loaderdata.data.searchterm} Vendors`}/>
            <Spacer gapsize='2'/>
            <p>
                {
                    categoryVendors.map(vendor=>{
                        // find the category name for this vendor's category Id
                        const category=allCategories.filter(categoryitem=>categoryitem.id===vendor.category_id).map(item=>item.category)[0];
                        return (
                            <div>
                                <VendorCard vendorname={vendor.vendor_name} category={category} baseprice={vendor.base_price?vendor.base_price:0}/>
                            </div>                            
                        )
                    })
                }
            </p>
        </section>
        :
        // All Vendors
        <section id="All Vendors" className=''>
            <div className='py-4'><Heading type='main' text={`All Vendors`}/></div>
            {
                allVendors.map(vendor=>{
                    const category=allCategories.filter(categoryitem=>categoryitem.id===vendor.category_id).map(item=>item.category)[0];
                    return (
                        <VendorCard vendorname={vendor.vendor_name} category={category} baseprice={vendor.base_price?vendor.base_price:0}/>
                    )
                })
            }
        </section>
        }

    </main>
  )
}
