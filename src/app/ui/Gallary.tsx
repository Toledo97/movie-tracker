'use client'

import * as React from 'react';
import { MovieProps, GallaryProps } from '@/app/lib/types'
import MovieCard from '@/app/ui/MovieCard'

import './gallary.css'

export default function Gallary({ MovieData, GallaryData }: { MovieData: MovieProps[], GallaryData: GallaryProps }) {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
    const scrollContainerRef = React.useRef(null);

    const handleWheel = React.useCallback((event: WheelEvent) => {
        if (scrollContainerRef.current) {
            event.preventDefault(); // Prevent default vertical scrolling
            scrollContainerRef.current.scrollLeft += event.deltaY; // Adjust horizontal scroll
        }
    }, []);

    React.useEffect(() => {
        const element = (scrollContainerRef.current as unknown) as HTMLElement ;
        if (element) {
            element.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (element) {
                element.removeEventListener('wheel', handleWheel);
            }
        };
    }, [handleWheel]);

    return (

        <div className='border border-solid border-white rounded-xl p-2 px-4'>

            <div className='flex flex-row overflow-x-auto gap-4 example' ref={scrollContainerRef}
>
                {MovieData.map((item) => (
                    <MovieCard MovieCardData={item} imageBaseUrl={imageBaseUrl} key={item.title + GallaryData.title} />
                ))}
            </div>

        </div>

    );
}

