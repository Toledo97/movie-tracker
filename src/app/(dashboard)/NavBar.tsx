import React from 'react';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/server'
import LoginModal, { LogoutButton } from '@/app/ui/Login-Modal'
import { cookies } from 'next/headers'

import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = async () => {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has('user');

    let userExists = hasCookie;

    if (!userExists) {
        const { data, error } = await supabase.auth.getUser()
        if (!error && data.user) {
            userExists = true;
        }
        // console.log('data ',data)
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg 
                            navbar-light bg-dark 
                            bg-opacity-75 text-light
                            fixed-top">
                <div className="container flex flex-row justify-evenly md:justify-center gap-2">

                    <LogoComponent />

                    <SearchComponent />

                    {!userExists ? <LoginModal /> : <LogoutButton />}

                </div>
            </nav >
        </div >
    );
};



function LogoComponent() {
    return (
        <div className='flex gap-2 items-center'>
            <img width={50} className='invert' src={'/images/A24_logo.png'}></img>
            <Link className="navbar-brand text-light font-bold"
                href="/">
                Tracker
            </Link>
        </div>)
}

function SearchComponent() {
    return (
        <form className="form-inline flex gap-2">
            <input className="form-control mr-sm-2 flex-1" type="search" placeholder="Search" aria-label="Search"></input>
            <button id="" className={`Default-button text-white font-bold py-2 px-4 border-b-4 rounded`} type={"submit"}>
                Search
            </button>
        </form>)
}



export default Navbar;