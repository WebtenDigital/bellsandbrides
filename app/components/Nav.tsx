import { Link } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import logo from '../images/logo-tp.png'
import {MainMenu} from '../utils/allmenus'
import Separator from './Separator'

type NavProps={
    loggedin: boolean
}

export default function Nav(props:NavProps) {
    const [showdropdown, setShowDropdown]=useState(false);

    // hide menu on click outside
    const menudropdownref=useRef<HTMLHeadingElement>(null);

    useEffect(()=>{
        function handleClickOutside(event:any){
            if(menudropdownref.current&&!menudropdownref.current.contains(event.target)){
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [menudropdownref]);

  return (
    <main className=''>
        {/* for mobile */}
        <nav id="menu-for-mobile" className='flex items-center justify-between lg:hidden'>
            <div className='w-3/12'>
                <Link to="/">
                    <img src={logo} alt="bells and brides logo"></img>
                </Link>
            </div>

            {/* <Link to="/myaccount"> */}
                <button id="hamburger menu" className='relative' onClick={()=>{setShowDropdown(prevstate=>prevstate=!prevstate)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>                    
                </button>
                {showdropdown&&<div ref={menudropdownref} id="the-menu-dropdown" className='absolute top-14 right-2 z-50'>
                    <div className='w-full pl-6 pr-10 py-4 text-sm bg-gray-100 rounded-lg'>
                        {
                            MainMenu.map(menuitem=>{
                                return (
                                    <Link onClick={()=>{setShowDropdown(false)}} to={menuitem.url}><div className='py-2 flex items-center gap-6'>
                                        <div>{menuitem.icon}</div>
                                        <p className='text-gray-600 font-bold'>{menuitem.name}</p>
                                    </div></Link>
                                )
                            })
                        }
                        <div className='pt-2 pb-1'><Separator bordercolor='gray-200'/></div>
                        {/* logout */}
                        <Link to="/logout"><div className='py-2 flex items-center gap-5'>
                            <div id="logout icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-peach rounded-full hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p className='text-peach font-bold'>Logout</p>
                        </div></Link>
                    </div>
                </div>
                    }
            {/* </Link> */}
        </nav>

        {/* for lg */}
        <nav id="menu-for-lg" className='hidden lg:block'>
            <div id="holder" className='flex items-center justify-between'>
                <div id="logo" className='w-2/12'><Link to="/"><img src={logo} className="w-7/12"/></Link></div>
                <div className='w-8/12 flex justify-center gap-12 text-gray-600'>
                    {
                        MainMenu.map(menuitem=>{
                            return(
                                <Link to={menuitem.url} className="font-bold hover:text-pink-400">{menuitem.name}</Link>
                            )
                        })
                    }
                </div> 
                {
                    // if logged in, show the user account icon, otherwise, show the login and sign up buttons
                    props.loggedin?
                    <div className='w-2/12 flex justify-end'>
                        <button className=''>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-peach rounded-full hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    :
                    <div className='w-2/12 flex justify-end'><Link to="/myaccount" className='px-5 py-1 text-white font-bold bg-[#F95344] rounded-xl hover:bg-pink-400'>Log in</Link></div>
                }
            </div>          
        </nav>
    </main>
  )
}
