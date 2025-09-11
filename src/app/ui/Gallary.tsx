'use client'

import * as React from 'react';
import { MovieProps, GallaryProps } from '@/app/lib/types'
import MovieCard from '@/app/ui/MovieCard'
import { Suspense } from 'react';
import Loading from '@/app/loading';
import Pagination from '@/app/ui/Pagination';
import FilterCheck from '@/app/ui/FilterGallary';
import Rating from '@mui/material/Rating';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import './gallary.css'
import { withTheme } from '@emotion/react';

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

        <div className='border-white border-r-1 border-b-1 border-l-1 rounded-b-xl p-4'>

            <div className='flex flex-row overflow-x-auto gap-4 example' ref={scrollContainerRef}
            >
                {MovieData.map((item) => (
                    <MovieCard MovieCardData={item} imageBaseUrl={imageBaseUrl} key={item.movie_id + GallaryData.title} />
                ))}
            </div>

        </div>

    );
}

function TitleCard({ title, total, userExists, average, max, card }: { title: string, total: number, userExists: boolean, max?: number, average?: number, card?: boolean }) {
    return (
        <div className='flex flex-col gap-2 items-center'>
            <div className='flex flex-row gap-2 items-center'>
                <div className='text-3xl'>{title}</div>
                {!card && total}
            </div>

            {card ?
                <div className='flex flex-row items-end h-[30px]'>
                    <Rating
                        name="simple-controlled"
                        value={average || 0}
                        className='pb-2'
                        readOnly
                    />

                    <Gauge sx={(theme) => ({
                        [`& .${gaugeClasses.valueText} text`]: {
                            fill: "#ffffff",
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#B71C1C',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                        },
                    })} width={50} height={50} value={total || 0} valueMax={max} startAngle={-90} endAngle={90} />

                </div> : <FilterCheck userExists={userExists} />
            }
        </div>
    )
}

export function DisplayCard({ title, allMovies, userExists, totalMovies, totalPages, pageType }: { title: string, totalMovies: number, userExists: boolean, totalPages: number, pageType: string, allMovies: MovieProps[] }) {
    return (
        <div className='flex flex-col gap-2'>
            <Suspense fallback={<Loading />}>
                <div className='flex flex-col gap-2'>
                    {<Gallary key={'all'} MovieData={allMovies} GallaryData={{ title: title, total: totalMovies }} />}
                </div>
            </Suspense>

            <div className="flex w-full justify-center">
                {<Pagination totalPages={totalPages} pageType={pageType} />}
            </div>
        </div>
    )
}


export function TabGallery({ allTitle, allTotal, wTitle, wTotal, myAvg, userExists }: { allTitle: string, allTotal: number, wTitle: string, wTotal: number, myAvg: number, userExists: boolean }) {

    return (
        <div className='flex flex-row '>

            <div className='flex gap-2 p-2 items-center flex-col text-white border-l-1 border-r-1 border-t-1 rounded-t-xl w-full hover:border-red-900'>
                <TitleCard
                    title={allTitle}
                    total={allTotal}
                    userExists={userExists}
                />

            </div>

            <div className='flex p-2 items-center flex-col text-white border-l-1 border-r-1 border-t-1 rounded-t-xl w-full hover:border-red-900'>
                <TitleCard
                    title={wTitle}
                    total={wTotal}
                    max={allTotal}
                    userExists={userExists}
                    average={myAvg}
                    card={true}
                />
            </div>
        </div>
    )

}