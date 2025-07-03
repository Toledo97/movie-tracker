'use client'

import * as React from 'react';
import { MovieProps, GallaryProps, MoviePropsV2 } from '@/app/lib/types'
import MovieCard, { MovieCardV2 } from '@/app/ui/MovieCard'

import './gallary.css'

export default function Gallary({ MovieData, GallaryData }: { MovieData: MovieProps[], GallaryData: GallaryProps }) {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
    const scrollContainerRef = React.useRef(null);

    const handleWheel = React.useCallback((event: WheelEvent) => {
        if (scrollContainerRef.current) {
            event.preventDefault(); // Prevent default vertical scrolling
            (scrollContainerRef.current as HTMLElement).scrollLeft += event.deltaY; // Adjust horizontal scroll
        }
    }, []);

    React.useEffect(() => {

        const element = (scrollContainerRef.current) ? scrollContainerRef.current as HTMLElement : scrollContainerRef.current;

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
                    <MovieCard MovieCardData={item} imageBaseUrl={imageBaseUrl} key={item.movie_id + GallaryData.title} />
                ))}
            </div>

        </div>

    );
}

export  function GallaryV2({ MovieData, GallaryData }: { MovieData: MoviePropsV2[], GallaryData: GallaryProps }) {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
    const scrollContainerRef = React.useRef(null);

    const handleWheel = React.useCallback((event: WheelEvent) => {
        if (scrollContainerRef.current) {
            event.preventDefault(); // Prevent default vertical scrolling
            (scrollContainerRef.current as HTMLElement).scrollLeft += event.deltaY; // Adjust horizontal scroll
        }
    }, []);

    React.useEffect(() => {

        const element = (scrollContainerRef.current) ? scrollContainerRef.current as HTMLElement : scrollContainerRef.current;

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
                    <MovieCardV2 MovieCardData={item} imageBaseUrl={imageBaseUrl} key={item.movie_id + GallaryData.title} />
                ))}
            </div>

        </div>

    );
}