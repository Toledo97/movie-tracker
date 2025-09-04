'use client'

import * as React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function FilterCheck({ userExists }: { userExists: boolean }) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [filter, setFilter] = React.useState(false)

    const createFilterURL = (filter: boolean) => {
        const params = new URLSearchParams(searchParams);
        params.set('f', `${filter}`);
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`)
    };

    const handleChange = () => {
        createFilterURL(!filter);
        setFilter(!filter);
    };

    React.useEffect(() => {
        createFilterURL(false);
        setFilter(false);
    }, [userExists])

    return (
        <div className={`flex flex-row gap-2 content-center ${userExists ? '' : 'hidden'}`}>

            <div
                onClick={() => handleChange()}
                className='hover:text-red-900'
            >
                {filter ? <VisibilityOffIcon /> : <VisibilityOffOutlinedIcon />}
            </div>


            <div className='text-md'>
                Filter Watched
            </div>
        </div>
    )
}