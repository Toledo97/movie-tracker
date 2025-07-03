import Dashboard from '@/app/(dashboard)/Dashboard';
import { cookies } from 'next/headers'
import Navbar from "@/app/(dashboard)/NavBar";
import { boolean } from 'zod';

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        f?: string;
        movie_id?: number;
        page?: number;
        page2?: number;
    }>;
}
) {
    const searchParams = await props.searchParams;
    const filter = searchParams?.f == 'true' ? true : false;
    const allMoviesPage = Number(searchParams?.page || 1);
    const WatchedMoviesPage = Number(searchParams?.page2 || 1);
    const query = searchParams?.query || '';

    return (
        <>
            <Dashboard currentPage={allMoviesPage} currentPage2={WatchedMoviesPage} term={query} filter={filter}/>;
        </>
    )
};
