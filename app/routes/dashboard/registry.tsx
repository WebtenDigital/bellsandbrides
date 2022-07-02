import DashFooter from "~/components/dashboard/DashFooter";
import Heading from "~/components/dashboard/Heading";

export default function Registry() {
  return (
    <main className="w-11/12 mx-auto">
        <Heading type="main" text="Registry"/>
        <DashFooter type="main" routename="registry"/>
    </main>
  )
}
