import Nav from '~/components/Nav'
import sicinfo from '../images/dashboard/sic-info.jpeg'
export default function Superlife() {
  return (
    <main>
        <Nav loggedin={true}/>
        <div className='flex items-start gap-4'>
        <div id="left" className='w-7/12'><img src={sicinfo} alt="sic"/></div>
        <div id="right" className='relative'>
            <div className='fixed top-20'>Info</div>
        </div>
        </div>
    </main>
  )
}
