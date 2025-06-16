'use client'

import * as React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function FilterCheck(){

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createFilterURL = (table: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('table', `${table}`);

        params.set('page', '1');
        
        if (params.has('action')){
            params.delete('action')
            params.delete('movie_id')
        }
        
        replace(`${pathname}?${params.toString()}`)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        switch (event.target.checked) {
            case true:
                createFilterURL(1);
                break;
            case false:
                createFilterURL(0);
                break;
        }

    };


    return(
        <div className='flex flex-row gap-2 content-center'>

                    <input
                        type="checkbox"
                        onChange={handleChange}
                    />

                    <div className='text-md'>
                        Filter Watched
                    </div>
                </div>
    )
}