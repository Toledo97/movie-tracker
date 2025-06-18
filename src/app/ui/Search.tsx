'use client';

import * as React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

function SearchComponent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createSearchURL = (query: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('query', `${query}`);

        replace(`${pathname}?${params.toString()}`)
    };

    return (
        <form className="form-inline flex gap-2" >
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
            <button id="" className={`Default-button text-white font-bold py-2 px-4 border-b-4 rounded`} type={"submit"}>
                <SearchIcon />
            </button>
        </form>)
}