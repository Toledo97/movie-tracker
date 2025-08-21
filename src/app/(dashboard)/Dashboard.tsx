
import './Dashboard.css';

import { MovieProps } from '@/app/lib/types';
import * as React from 'react';
import Gallary from '@/app/ui/Gallary';
import Navbar from "@/app/(dashboard)/NavBar";
import Pagination from '@/app/ui/Pagination';
import { createClient } from '@/app/utils/supabase/server';
import FilterCheck from '@/app/ui/FilterGallary';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { cookies } from 'next/headers';

import { getMovieCount, getWatchedMovieCount, getMovies, getWatchedMovies, searchMovies } from '@/app/lib/actions';
import { calculateDBIdx } from '@/app/utils/utils';

export default async function Dashboard({ currentPage, currentPage2, term, filter }: { currentPage: number, currentPage2: number, term: string, filter: boolean }) {
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

    const [totalMovies, totalWatchedMovies] = await Promise.all(
        [
            getMovieCount(),
            getWatchedMovieCount()
        ]
    )

    const totalMoviesFiltered = filter ? totalMovies - totalWatchedMovies : totalMovies;

    const pageSize = 10;
    const totalPages = Math.ceil(totalMoviesFiltered / pageSize);
    const [startIdx, endIdx] = calculateDBIdx(currentPage, totalMoviesFiltered, pageSize)

    const totalWatchedPages = Math.ceil(totalWatchedMovies / pageSize);
    const [startIdxWatched, endIdxWatched] = calculateDBIdx(currentPage2, totalWatchedMovies, pageSize)

    const GallaryTabAll = { title: 'All Movies', total: totalMoviesFiltered }
    const GallaryTabWatched = { title: 'Watched Movies', total: totalWatchedMovies }

    const [allMovies, allWatchedMovies] = await Promise.all(
        [
            getMovies(startIdx, endIdx, filter),
            getWatchedMovies(startIdxWatched, endIdxWatched, totalWatchedMovies, 1),
        ]
    )

    const searchRes = (term) ? await searchMovies(term) : [] as MovieProps[];




    return (
        <main className='flex flex-col bg-slate-700'>
            <Navbar MovieData={searchRes} userExists={userExists}></Navbar>
            <div className="flex flex-col gap-4 p-4 pt-2">

                <div className='flex flex-col gap-2 text-white'>

                    <TitleCard
                        title={GallaryTabAll.title}
                        total={GallaryTabAll.total}
                    />

                    <FilterCheck userExists={userExists} />

                    <DisplayCard
                        title={GallaryTabAll.title}
                        userExists={userExists}
                        allMovies={allMovies}
                        totalMovies={totalMoviesFiltered}
                        totalPages={totalPages}
                        pageType={'page'}
                    />
                </div>


                <div className='flex flex-col gap-2 text-white'>

                    <TitleCard
                        title={GallaryTabWatched.title}
                        total={GallaryTabWatched.total}
                    />

                    <DisplayCard
                        title={GallaryTabWatched.title}
                        userExists={userExists}
                        allMovies={allWatchedMovies}
                        totalMovies={totalWatchedMovies}
                        totalPages={totalWatchedPages}
                        pageType={'page2'}
                    />


                </div>
            </div>
        </main>
    )
}

function TitleCard({ title, total }: { title: string, total: number }) {
    return (
        <div className='flex flex-row gap-4 items-end'>
            <div className='text-3xl'>{title}</div>
            <div>{total || 0} Films</div>
        </div>
    )
}

async function DisplayCard({ title, allMovies, userExists, totalMovies, totalPages, pageType }: { title: string, totalMovies: number, userExists: boolean, totalPages: number, pageType: string, allMovies: MovieProps[] }) {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <div className='flex flex-col gap-2'>
                    {<Gallary key={'all'} MovieData={allMovies} GallaryData={{ title: title, total: totalMovies }} />}
                </div>
            </Suspense>
            <div className="flex w-full justify-center">
                {<Pagination totalPages={totalPages} pageType={pageType} />}
            </div>
        </>
    )
}