import DashboardLayout from "~/components/dashboard/DashboardLayout";

const leftmenu=<div>
{
  [...Array(5)].map(item=>{
    return (
      <div>Hello</div>
    )
  })
}
</div>

const maincontent=<div>
  {
    [...Array(50)].map(item=>{
      return (
        <div>Hello Good Morning</div>
      )
    })
  }
</div>

export default function Dashtest() {
  return (
    <main>
        <div className="w-11/12 mx-auto"><DashboardLayout title="Dash Test" ceremony="Wedding" leftmenu={leftmenu} maincontent={maincontent}/></div>
    </main>
  )
}