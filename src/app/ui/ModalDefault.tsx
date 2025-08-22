'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MovieProps, DictionaryNum } from '@/app/lib/types';
import Rating from '@mui/material/Rating';
import TheatersIcon from '@mui/icons-material/Theaters';
import StreamIcon from '@mui/icons-material/Stream';
import type { ReactNode } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { sqlActionFunc } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

import './gallary.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const cardActions: DictionaryNum = {
    "Method": 0,
    "Favorite": 1,
    "Watched": 2,
    "rmWatched": 3,
    "Rating": 4
};

export default function MovieModal({ children, MovieData, imgUrl }: Readonly<{ children: ReactNode, MovieData: MovieProps, imgUrl: string }>) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const MyModal = React.forwardRef(() => <BasicModal MovieData={MovieData} imgUrl={imgUrl} />);

    return (
        <>
            <button onClick={handleOpen} type={"submit"}>{children}</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <MyModal />
            </Modal>
        </>
    )
}


function BasicModal({ MovieData, imgUrl }: { MovieData: MovieProps, imgUrl: string }) {
    // const [value, setValue] = React.useState<number | null>(MovieData.rating);
    const { refresh } = useRouter();

    const toggle = (movie_id: number, action: string, rating?: number) => {
        sqlActionFunc(movie_id, cardActions[action], rating)
        refresh()
    };

    return (
        // <div >
        <Box sx={style} className='flex flex-col bg-slate-500 rounded-xl text-white h-7/10  my-4'>
            <Typography id="modal-modal-title" variant="h6" component="h2" className=''>
                <div className='text-center'>
                    <b>{MovieData.title}</b><hr></hr>
                </div>
            </Typography>
            <form className='flex md:flex-row flex-col gap-4 overflow-y-auto example'>

                {MovieData.poster_path !== 'None' &&
                    <div className='flex relative z-0 w-48 h-80'>
                        <img
                            src={`${imgUrl}${MovieData.poster_path}`}
                            alt={MovieData.title}
                            width={250}
                            height={75}
                        />
                        <div className='absolute flex z-10 top-0 right-0 p-2 text-white' onClick={() => toggle(MovieData.movie_id, "Favorite")}>
                            {!MovieData.favorited ? <FavoriteBorderIcon className='hover:text-red-400' /> : <FavoriteIcon className='hover:text-red-400' />}
                        </div>
                    </div>
                }
                <div className='flex flex-col gap-2 '>
                    <div className='font-bold'>Your Rating</div>
                    <Rating
                        name="simple-controlled"
                        value={MovieData.rating}
                        onChange={(event, newValue) => {
                            toggle(MovieData.movie_id, "Rating", newValue as number,);
                        }}
                    />

                    <div className='font-bold'>
                        View Method:
                    </div>

                    <div onClick={() => toggle(MovieData.movie_id, "Method")} className='flex flex-row gap-2 border-2 border-solid px-2 rounded border-gray-400 hover:border-blue-400 w-min'>
                        <div>
                            {(MovieData.method ? <>Theater</> : <>Streamed</>)}
                        </div>
                        {(MovieData.method ? <TheatersIcon /> : <StreamIcon />)}

                    </div>
                    <div className='font-bold'>
                        Release
                    </div>
                    <div>

                        {MovieData.release_date}
                    </div>
                    <div className='font-bold'>
                        Overview
                    </div>
                    <div className='w-64'>

                        {MovieData.overview}
                    </div>
                </div>

            </form>
        </Box>
        // </div>
    );
}