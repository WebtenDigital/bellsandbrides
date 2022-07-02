import DashFooter from "~/components/dashboard/DashFooter";
import Heading from "~/components/dashboard/Heading";

export default function ManageAccount() {
  return (
    <main className="w-11/12 mx-auto">
        <Heading type="main" text="Manage Account"/>
        <DashFooter type="main" routename="account"/>
    </main>
  )
}