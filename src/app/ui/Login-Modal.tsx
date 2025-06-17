'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import { LoginComponent } from '../login/page';
import Modal from '@mui/material/Modal';
import { login, signup, logout } from '@/app/lib/actions'

import '@/app/ui/button.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 666,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function LoginComponent() {
  return (
    <form className='flex'>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />

      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
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
            <button onClick={handleOpen} id="" className={`Login-button text-white font-bold py-2 px-4 border-b-4 rounded`} type={"submit"}>Login</button>
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
            className={`Default-button text-white font-bold py-2 px-4 border-b-4 rounded`} 
            type={"submit"}>Logout</button>
    )
}



function BasicModal() {
    return (
        <div>

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <div className='text-center'>
                        <b>Login / Sign Up </b><hr></hr>
                    </div>
                </Typography>
                {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
                <LoginComponent />
                {/* </Typography> */}
            </Box>
        </div>
    );
}

