import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';

import './globals.css';

export const metadata: Metadata = {
    title: 'Movie Tracking App',
    description: 'Basic Movie Tracking App'
};



const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='en'>
            <AppRouterCacheProvider>
                <body className={`bg-black flex flex-col h-screen`}>
                    <ThemeProvider>{children}</ThemeProvider>
                </body>
            </AppRouterCacheProvider>

        </html>
    );
};

export default Layout;
