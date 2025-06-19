'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { login, signup, logout } from '@/app/lib/actions'
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { FormState } from '@/app/lib/types'

import LoginIcon from '@mui/icons-material/Login';
import '@/app/ui/button.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const initialState: FormState = { error: {} };


function LoginComponent() {
    const [state, formAction, isPending] = React.useActionState(login, initialState);

    return (
        <form className='flex flex-col gap-2' action={formAction}>
            <div>
                <label htmlFor="email">Email:</label>
                <input className="form-control" id="email" name="email" type="email" required />

            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input className="form-control" id="password" name="password" type="password" required />
            </div>

            <button className='Login-button text-white font-bold py-2 px-4 border-b-4 rounded' >Log in</button>

                {state?.error?.message && <div className='text-red-700'><ErrorOutlineIcon />  {state?.error?.message}</div>}

        </form>
    )
}

export default function LoginModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const MyModal = React.forwardRef(() => <BasicModal />);

    return (
        <>
            <button onClick={handleOpen} id="" className={`Login-button text-white font-bold py-2 px-4 rounded`} type={"submit"}><LoginIcon/></button>
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

export function LogoutButton() {
    return (
        <button onClick={logout} id=""
            className={`Default-button text-white font-bold px-4 h-10 rounded`}
            type={"submit"}><LogoutIcon /></button>
    )
}



function BasicModal() {

    return (
        <div>

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <div className='text-center'>
                        <b>Login</b><hr></hr>
                    </div>
                </Typography>
                <LoginComponent />
            </Box>
        </div>
    );
}

