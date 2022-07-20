// import { db } from "./db.server";

// // formdata
// export const addOrRemovedHeartedVendor=async(formdata:FormData, sessionId:number)=>{
//     // on clicking the heart, add or remove from the user_vendors table
//     const likedstatus=formdata.get('likedstatus')?.toString();
//     const vendorId=formdata.get('vendor_id')?.toString();
//     const vendorCategory=formdata.get('vendor_category')?.toString();

//     // add liked vendor to user_vendors
//     if(likedstatus==='liked'){
//         const createUserVendorJoiner=await db.user_vendors.create({
//             data:{
//                 user_id: sessionId,
//                 vendor_id: parseInt(vendorId?vendorId:""),
//                 vendor_category: vendorCategory
//             }
//         });
//     }
//     else if(likedstatus==='unliked'){
//         const deleteVendor=await db.user_vendors.deleteMany({
//             where: {
//                 vendor_id: parseInt(vendorId?vendorId:"")
//             }
//         });
//     }
// }

export const hello=()=>{}