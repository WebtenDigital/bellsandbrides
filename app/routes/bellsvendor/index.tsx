import CTA from "~/components/dashboard/CTA";

export default function BellsVendorIndex() {
  // this page is a landing page for becoming a vendor. it should entice someone to sign up their business.
  return (
    <main className="w-11/12 mx-auto">
      <div>bells vendor index</div>
      <CTA type="fillednoarrow" text="Sign Up" url="/bellsvendor/onboarding"/>
    </main>
  )
}
