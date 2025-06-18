import Dashboard from '@/app/(dashboard)/Dashboard';
import { cookies } from 'next/headers'

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        table?: number;
        movie_id?: number;
        page?: number;
        page2?: number;
    }>;
}
) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page || 1);
    const currentPage2 = Number(searchParams?.page2 || 1);

    const cookieStore = await cookies();
    const hasCookie = cookieStore.has('user');

    const tables = ['all_films', 'all_films_filtered_watched'];
    const table = hasCookie ? tables[searchParams?.table || 0] : tables[0];
    const query = searchParams?.query || '';

    return (
        <>
            <Dashboard currentPage={currentPage} currentPage2={currentPage2} table={table} />;
        </>
    )
};
