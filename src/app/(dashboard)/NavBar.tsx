import React from 'react';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/server'
import LoginModal, { LogoutButton } from '@/app/ui/Login-Modal'
import { cookies } from 'next/headers'
import SearchIcon from '@mui/icons-material/Search';
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
    }

    return (
        <nav className="navbar navbar-expand-lg 
                            navbar-light bg-dark 
                            bg-opacity-75 text-light
                            fixed-top">
            <div className="flex flex-wrap w-full justify-center gap-3 md:gap-2 p-2">

                <LogoComponent />
                <div className='flex flex-row gap-2'>

                    <SearchComponent />

                    {!userExists ? <LoginModal /> : <LogoutButton />}

                </div>
            </div>
        </nav >
    );
};



function LogoComponent() {
    return (
        <div className='flex gap-2 items-center' >
            <Link className="flex flex-row text-light font-bold gap-2" style={{ textDecoration: 'none' }}
                href="/">
                <img width={50} className='invert' src={'/images/A24_logo.png'}></img>
                Tracker
            </Link>
        </div>)
}

function SearchComponent() {
    return (
        <form className="form-inline flex gap-2">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
            <button id="" className={`Default-button text-white font-bold py-2 px-4 border-b-4 rounded`} type={"submit"}>
                <SearchIcon />
            </button>
        </form>)
}



export default Navbar;