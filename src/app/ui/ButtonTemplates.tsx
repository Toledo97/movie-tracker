'use client';

import { ButtonProps } from '@/app/lib/types'
import './button.css'

export function StyledButton({ handleAction, type = "submit", children }: ButtonProps) {
    return (<button onClick={handleAction} id="Login" className={`text-white 
                                            font-bold py-2 px-4 border-b-4 border-red-950 
                                            hover:border-red-900 rounded`} type={type}>
        {children}
    </button>)
}