
import './Dashboard.css';

import { MovieProps } from '@/app/lib/types';
import * as React from 'react';
import Gallary, { TabGallery, DisplayCard } from '@/app/ui/Gallary';
import Navbar from "@/app/(dashboard)/NavBar";
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';

import { getMovieCount, getWatchedMovieCount, getMovies, getWatchedMovies, searchMovies, statActionFunc } from '@/app/lib/actions';
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

    const GallaryTabAll = { title: 'All Films', total: totalMoviesFiltered, pageType: "page" }
    const GallaryTabWatched = { title: 'Watched', total: totalWatchedMovies, pageType: "page2" }

    const [allMovies, allWatchedMovies, myAvg] = await Promise.all(
        [
            getMovies(startIdx, endIdx, filter),
            getWatchedMovies(startIdxWatched, endIdxWatched, totalWatchedMovies, 1),
            statActionFunc()
        ]
    );

    const searchRes = (term) ? await searchMovies(term) : [] as MovieProps[];

    return (
        <main className='flex flex-col bg-slate-700 h-screen'>
            <Navbar MovieData={searchRes} userExists={userExists}></Navbar>
            <div className="flex flex-col gap-4 p-4 pt-2">

                <div className='flex flex-col '>

                    <TabGallery
                        allTitle={GallaryTabAll.title}
                        allTotal={GallaryTabAll.total}
                        wTitle={GallaryTabWatched.title}
                        wTotal={GallaryTabWatched.total}
                        myAvg={myAvg}
                        userExists={userExists}
                    />

                    <div className='w-full border-b-1 border-white rounded-b-l'></div>

                    <DisplayCard
                        title={GallaryTabAll.title}
                        userExists={userExists}
                        allMovies={allMovies}
                        totalMovies={totalMoviesFiltered}
                        totalPages={totalPages}
                        pageType={'page'}
                    />
                </div>


                {/* <div className='flex flex-col gap-2 text-white'>
                    <DisplayCard
                        title={GallaryTabWatched.title}
                        userExists={userExists}
                        allMovies={allWatchedMovies}
                        totalMovies={totalWatchedMovies}
                        totalPages={totalWatchedPages}
                        pageType={'page2'}
                    />
                </div> */}
            </div>
        </main>
    )
}
