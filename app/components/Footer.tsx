import { Link } from '@remix-run/react'
import { footerLinks, footerOtherLinks, footerVendorLinks } from '~/utils/allmenus'
import logo from '../images/logo-tp.png'
import linelogo from '../images/bellsandbrides-line-tp.png'
import Sentence from './dashboard/Sentence'
import Spacer from './Spacer'

export default function Footer() {
  return (
    <main className='pt-8 pb-1 bg-[#F8F8F8]'>
        <div className='w-11/12 mx-auto'>
            <div className="flex gap-4">
                <section id="left" className="w-7/12">
                    <Link to="/" className='block w-6/12'><img src={logo}/></Link>
                    <div className='py-4'><Sentence text="Your Online Wedding Resource"/></div>
                    <div id="socials" className='flex items-center gap-4'>
                        <Link to="" id="facebook"><svg className='block h-8 w-8 fill-gray-600' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg></Link>
                        <Link to="" id="twitter"><svg className='block h-8 w-8 fill-gray-600' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/></svg></Link>
                        <Link to="" id="instagram"><svg className='block h-8 w-8 fill-gray-600' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z"/></svg></Link>
                    </div>
                    <div id="other links" className='py-4'>
                        {
                            footerOtherLinks.map(link=>{
                                return (
                                    <Link to={link.url} className="block py-1 text-sm text-gray-700">{link.name}</Link>
                                )
                            })
                        }
                    </div>
                    <Sentence text="info@bellsandbrides.com"/>
                </section>

                <section id="right" className="w-6/12">
                    <div className='mt-4'>
                        <h4 className='text-gray-500  font-bold'>Bells and Brides</h4>
                        {
                            footerLinks.map(link=>{
                                return (
                                    <Link to={link.url} className="block py-1 text-sm text-gray-700">{link.name}</Link>
                                )
                            })
                        }
                    </div>

                    <div><Spacer gapsize='5'/></div>

                    <div>
                        <h4 className='text-gray-500  font-bold'>Become a Vendor</h4>
                        {
                            footerVendorLinks.map(link=>{
                                return (
                                    <Link to={link.url} className="block text-sm text-gray-700">{link.name}</Link>
                                )
                            })
                        }
                    </div>
                </section>
            </div>
        </div>
        <div className='my-6 border-t border-gray-200'></div>
        <section id="bottom">
            <div className='w-11/12 mx-auto flex justify-between items-center'>
                <div className='w-5/12'><img src={linelogo}/></div>  
                <div className='flex items-center gap-1'>
                    <p className='text-lg text-gray-600'>&copy;</p>
                    <p className='text-gray-700 text-xs uppercase tracking-tight'>Bells and Brides, Inc</p>
                </div>
            </div>
        </section>
    </main>
  )
}
