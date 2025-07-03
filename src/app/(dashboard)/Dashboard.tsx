
import './Dashboard.css';

import { MovieProps } from '@/app/lib/types';
import * as React from 'react';
import Gallary, { GallaryV2 } from '@/app/ui/Gallary';
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

    const GallaryData1 = { title: 'All Movies', total: totalMoviesFiltered }
    const GallaryData2 = { title: 'Watched Movies', total: totalWatchedMovies }

    const [allMovies, allWatchedMovies] = await Promise.all(
        [
            getMovies(startIdx, endIdx, filter),
            getWatchedMovies(startIdxWatched, endIdxWatched, totalWatchedMovies),
        ]
    )

    const searchRes = (term) ? await searchMovies(term) : [] as MovieProps[]

    return (
        <main className='flex flex-col '>
            <Navbar MovieData={searchRes} userExists={userExists}></Navbar>
            <div className="row-start-1 flex flex-col gap-4 p-4">
                <div>
                    <div className='flex flex-col gap-2 text-white px-4'>
                        <Suspense fallback={<Loading />}>

                            <div className='flex flex-row gap-4 items-end'>
                                {GallaryData1.title ? <div className='text-3xl'>{GallaryData1.title}</div> : <></>}

                                <div>{GallaryData1.total || 0} Films</div>

                            </div>
                        </Suspense>

                            <FilterCheck userExists={userExists} />

                        <Suspense fallback={<Loading />}>

                            {<Gallary key={'all'} MovieData={allMovies as MovieProps[]} GallaryData={{ title: 'All Movies', total: totalMoviesFiltered }} />}

                        </Suspense>
                    </div>
                    <div className="mt-5 flex w-full justify-center">
                        {<Pagination totalPages={totalPages} pageType={'page'} />}
                    </div>
                </div>

                <div>
                    <Suspense fallback={<Loading />}>
                        <div className='flex flex-col gap-2 text-white px-4'>

                            <div className='flex flex-row gap-4 items-end'>
                                {GallaryData2.title ? <div className='text-3xl'>{GallaryData2.title}</div> : <></>}

                                <div>{GallaryData2.total || 0} Films</div>

                            </div>
                            {<GallaryV2 key={'watched'} MovieData={allWatchedMovies} GallaryData={{ title: 'Watched Movies', total: totalWatchedMovies }} />}
                        </div>
                    </Suspense>

                    <div className="mt-5 flex w-full justify-center">
                        {<Pagination totalPages={totalWatchedPages} pageType={'page2'} />}
                    </div>
                </div>
            </div>
        </main>
    )
}