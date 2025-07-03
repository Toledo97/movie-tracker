'using client'

import * as React from 'react';

import { MovieProps, MoviePropsV2 } from '@/app/lib/types'
import Tooltip from '@mui/material/Tooltip';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TheatersIcon from '@mui/icons-material/Theaters';
import StreamIcon from '@mui/icons-material/Stream';

import { useRouter } from 'next/navigation';
import { sqlFunction, } from '@/app/lib/actions'

export function MovieCardV2({ MovieCardData, imageBaseUrl }: { MovieCardData: MoviePropsV2, imageBaseUrl: string }) {

    const { refresh } = useRouter();

    const handleClick = (movie_id: number, watched: boolean) => {

        switch (watched) {
            case true:
                sqlFunction(movie_id,3);
                break;
            case false:
                sqlFunction(movie_id,2);
                break;
        }
        refresh()
    };

    const toggle = (movie_id: number) => {

        sqlFunction(movie_id,0)
        refresh()
    };

    const toggle2 = (movie_id: number) => {

        sqlFunction(movie_id,1)
        refresh()
    };

    const MovieData = MovieCardData.movies

    return (
        <div className='flex-none my-2' >
            <div className='flex flex-col gap-2'>
                <div className='relative flex flex-col max-w-3xs z-0 justify-end'>

                    {MovieData?.poster_path ?
                        <img
                            src={`${imageBaseUrl}${MovieData.poster_path}`}
                            alt={MovieData.title}
                            className=''
                            width={250}
                            height={100}
                        /> : <BlankMovieCard />
                    }
                    <div className='absolute flex flex-row justify-end z-10 w-full gap-4 p-1'>

                        {
                            MovieData && (
                            <button onClick={() => {toggle(MovieCardData.movie_id)}}>
                                {(MovieCardData.method ? <TheatersIcon className='flex' /> : <StreamIcon className='flex' />)}
                            </button>
                            )
                        }

                    </div>
                </div>

                <div className='flex flex-col max-w-3xs z-0 p-1'>

                    <Tooltip title={MovieData?.title}>
                        <div className={`max-w-3xs text-lg truncate`}>
                            {MovieData?.title}
                            {MovieCardData.method}
                        </div>
                    </Tooltip>
                    <div className='flex flex-row justify-end z-10 w-full gap-4 py-2'>


                        <button onClick={() => toggle2(MovieCardData.movie_id)}>
                            {!MovieCardData.favorited ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                        </button>
                        <button onClick={() => handleClick(MovieCardData.movie_id, MovieData !== null || false)}>
                            {MovieData === null ? <VisibilityOutlinedIcon /> : <VisibilityIcon />}
                        </button>
                    </div>
                </div>

            </div>
        </div>)
}

export default function MovieCard({ MovieCardData, imageBaseUrl }: { MovieCardData: MovieProps, imageBaseUrl: string }) {

    const { refresh } = useRouter();

    const handleClick = (movie_id: number, watched: boolean) => {

        switch (watched) {
            case true:
                sqlFunction(movie_id,3);
                break;
            case false:
                sqlFunction(movie_id,2);
                break;
        }
        refresh()
    };

    const toggle = (movie_id: number) => {

        sqlFunction(movie_id,0)
        refresh()
    };

    const toggle2 = (movie_id: number) => {

        sqlFunction(movie_id,1)
        refresh()
    };

    return (
        <div className='flex-none my-2' >
            <div className='flex flex-col gap-2'>
                <div className='relative flex flex-col max-w-3xs z-0 justify-end'>

                    {MovieCardData.poster_path !== 'None' ?
                        <img
                            src={`${imageBaseUrl}${MovieCardData.poster_path}`}
                            alt={MovieCardData.title}
                            className=''
                            width={250}
                            height={100}
                        /> : <BlankMovieCard />
                    }
                    <div className='absolute flex flex-row justify-end z-10 w-full gap-4 p-1'>

                        {
                            MovieCardData.watched && (
                            <button onClick={() => {toggle(MovieCardData.movie_id)}}>
                                {(MovieCardData.method ? <TheatersIcon className='flex' /> : <StreamIcon className='flex' />)}
                            </button>
                            )
                        }

                    </div>
                </div>

                <div className='flex flex-col max-w-3xs z-0 p-1'>

                    <Tooltip title={MovieCardData.title}>
                        <div className={`max-w-3xs text-lg truncate`}>
                            {MovieCardData.title}
                            {MovieCardData.method}
                        </div>
                    </Tooltip>
                    <div className='flex flex-row justify-end z-10 w-full gap-4 py-2'>


                        <button onClick={() => toggle2(MovieCardData.movie_id)}>
                            {!MovieCardData.favorited ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                        </button>
                        <button onClick={() => handleClick(MovieCardData.movie_id, MovieCardData.watched || false)}>
                            {!MovieCardData.watched ? <VisibilityOutlinedIcon /> : <VisibilityIcon />}
                        </button>
                    </div>
                </div>

            </div>
        </div>)
}

function BlankMovieCard() {
    return (
        <div className='flex relative z-0'>
            <div className='h-93 w-60 border-dotted border-7 border-yellow-300 rounded relative z-10'></div>
            <div className='h-93 w-60 border-4 border-red-700 rounded absolute'></div>
        </div>
    )
}

