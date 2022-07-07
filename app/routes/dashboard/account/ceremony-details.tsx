import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react';
import Heading from '~/components/dashboard/Heading'
import { getCeremony } from '~/utils/auth.server';
import { storage } from '~/utils/session';

// SERVER
export const loader:LoaderFunction=async ({request})=>{
    const session=await storage.getSession(request.headers.get('Cookie'));

    const ceremony=await getCeremony(session);

    return json({
      data: {
        ceremony: ceremony
      }
    });
}

type LoaderData={
  data: {
    ceremony: string
  }
}

// CLIENT
export default function CeremonyDetails() {
  const loaderdata:LoaderData=useLoaderData();
  return (
    <main>
        <Heading type='main' text={`${loaderdata.data.ceremony} Details`}/>
    </main>
  )
}
