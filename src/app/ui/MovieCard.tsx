'using client'

import * as React from 'react';

import { MovieProps, DictionaryNum } from '@/app/lib/types'
import Tooltip from '@mui/material/Tooltip';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TheatersIcon from '@mui/icons-material/Theaters';
import StreamIcon from '@mui/icons-material/Stream';

import { useRouter } from 'next/navigation';
import { sqlActionFunc, } from '@/app/lib/actions';

import MovieModal from '@/app/ui/ModalDefault';
import truncate from 'truncate';

const cardActions: DictionaryNum = {
    "Method" : 0,
    "Favorite" : 1,
    "Watched" : 2,
    "rmWatched" : 3,
    "Rating" : 4
};

export default function MovieCard({ MovieCardData, imageBaseUrl }: { MovieCardData: MovieProps, imageBaseUrl: string }) {

    const { refresh } = useRouter();

    const handleClick = (movie_id: number, watched: boolean) => {

        switch (watched) {
            case true:
                sqlActionFunc(movie_id, cardActions["rmWatched"]);
                break;
            case false:
                sqlActionFunc(movie_id, cardActions["Watched"]);
                break;
        }
        refresh()
    };

    const toggle = (movie_id: number, action: string) => {

        sqlActionFunc(movie_id, cardActions[action])
        refresh()
    };

    const truncatedText = truncate(MovieCardData.title, 15);

    return (
        <div className='flex-none text-white' >
            <div className='flex flex-col'>
                <div className='relative flex flex-col max-w-2xs z-0 justify-end'>
                    <MovieModal MovieData={MovieCardData} imgUrl={imageBaseUrl}>
                        {MovieCardData.poster_path !== 'None' ?
                            <img
                                src={`${imageBaseUrl}${MovieCardData.poster_path}`}
                                alt={truncatedText}
                                className='rounded-t-lg'
                                width={185}
                                height={75}
                            /> : <BlankMovieCard />
                        }</MovieModal>
                    <div className='absolute flex flex-row justify-end z-10 w-full gap-4 p-1'>

                        {
                            MovieCardData.watched && (
                                <div className='flex justify-center rounded-full bg-slate-900 p-1' onClick={() => { toggle(MovieCardData.movie_id, "Method") }}>
                                    <button className='flex'>
                                        {(MovieCardData.method ? <TheatersIcon className='hover:text-red-400' /> : <StreamIcon className='hover:text-blue-400' />)}
                                    </button>
                                </div>
                            )
                        }

                    </div>
                </div>

                <div className='flex flex-col max-w-2xs z-0 p-1 bg-slate-900 '>

                    <Tooltip title={MovieCardData.title}>
                        <div className={`font-bold truncate p-2`}>
                            {truncatedText}
                        </div>
                    </Tooltip>
                    <div className='flex flex-row justify-end z-10 w-full gap-4 p-2'>
                        <button onClick={() => toggle(MovieCardData.movie_id, "Favorite")} >
                            {!MovieCardData.favorited ? <FavoriteBorderIcon className='hover:text-red-400' /> : <FavoriteIcon className='hover:text-red-400' />}
                        </button>
                        <button onClick={() => handleClick(MovieCardData.movie_id, MovieCardData.watched || false)}>
                            {!MovieCardData.watched ? <VisibilityOutlinedIcon className='hover:text-green-400' /> : <VisibilityIcon className='hover:text-green-400' />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BlankMovieCard() {
    return (
        <div className='flex relative z-0'>
            <div className='h-90 w-54 border-dotted border-7 border-yellow-300 rounded relative z-10'></div>
            <div className='h-90 w-54 border-4 border-red-700 rounded absolute'></div>
        </div>
    )
}

