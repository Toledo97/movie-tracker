'use client'

import * as React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function FilterCheck({ userExists }: { userExists: boolean }) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createFilterURL = (filter: boolean) => {
        const params = new URLSearchParams(searchParams);
        params.set('f', `${filter}`);
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {


        createFilterURL(event.target.checked);


    };

    React.useEffect(() => {
        createFilterURL(false)
    }, [userExists])

    return (
        <div className='flex flex-row gap-2 content-center'>

            <input
                type="checkbox"
                onChange={handleChange}
                disabled={!userExists}
            />

            <div className='text-md'>
                Filter Watched
            </div>
        </div>
    )
}