'use client'

import * as React from 'react';
import { MovieProps, GallaryProps } from '@/app/lib/types'
import MovieCard from '@/app/ui/MovieCard'

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';


export default function Gallary({ MovieData, GallaryData }: { MovieData: MovieProps[], GallaryData: GallaryProps }) {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';

    return (
        <>
            <div className='flex flex-row overflow-x-auto gap-4'>
                {MovieData.map((item) => (
                    <MovieCard MovieCardData={item} imageBaseUrl={imageBaseUrl} key={item.title + GallaryData.title} />
                ))}
            </div>
        </>

    );
}

