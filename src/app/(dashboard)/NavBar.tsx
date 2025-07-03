import LoginModal, { LogoutButton } from '@/app/ui/Login-Modal'
import { createClient } from '@/app/utils/supabase/server'
import MovieSelect from '@/app/ui/Search'
import { cookies } from 'next/headers'
import Link from 'next/link';
import React from 'react';
import { MovieProps } from '@/app/lib/types'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'

const Navbar = async ({ MovieData, userExists }: { MovieData: MovieProps[], userExists: boolean }) => {

    return (
        <div className='md:h-20 h-24'>

            <nav className="navbar navbar-expand-lg 
                            navbar-light bg-dark 
                            bg-opacity-75 text-light
                            fixed-top ">
                <div className="flex flex-wrap w-full items-center justify-center gap-3 md:gap-2 p-2">

                    <LogoComponent />
                    <div className='flex flex-row gap-2 items-end '>

                        {/* <MovieSelect MovieData={MovieData} /> */}

                        {!userExists ? <LoginModal /> : <LogoutButton />}

                    </div>
                </div>

            </nav >
        </div>

    );
};



function LogoComponent() {
    return (
        <div >
            <Link className="flex flex-rows text-light font-bold gap-2 items-center " style={{ textDecoration: 'none' }}
                href="/">
                <img width={50} src={'/images/popcorn.png'}></img>
                <div className='logo-title'>
                    Movie Tracker
                </div>
            </Link>
        </div>)
}


export default Navbar;