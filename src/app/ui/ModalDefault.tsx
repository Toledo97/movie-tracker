'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MovieProps } from '@/app/lib/types'
import Rating from '@mui/material/Rating';
import TheatersIcon from '@mui/icons-material/Theaters';
import StreamIcon from '@mui/icons-material/Stream';
import LoginIcon from '@mui/icons-material/Login';
import type { ReactNode } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
    const [value, setValue] = React.useState<number | null>(2);


    return (
        <div >
            <Box sx={style} className='min-w-lg bg-slate-500 rounded-xl'>
                <Typography id="modal-modal-title" variant="h6" component="h2" className='min-w-56 '>
                    <div className='text-center'>
                        <b>{MovieData.title}</b><hr></hr>
                    </div>
                </Typography>
                <form className='flex flex-row gap-4'>

                    <div className='flex relative z-0 w-full'>


                        {MovieData.poster_path !== 'None' ?
                            <img
                                src={`${imgUrl}${MovieData.poster_path}`}
                                alt={MovieData.title}
                                className=''
                                width={250}
                                height={100}
                            /> : <></>
                        }
                        <div className='absolute flex z-10 top-0 right-0 p-2'>
                            {!MovieData.favorited ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='font-bold'>Your Rating</div>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        />


                        <div className='font-bold'>
                            View Method:
                        </div>

                        <div className='flex flex-row gap-2 border-1 border-solid px-2 rounded border-gray-400 hover:border-blue-400 w-min'> 
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
                        <div>

                            {MovieData.overview}
                        </div>
                    </div>

                </form>
            </Box>
        </div>
    );
}