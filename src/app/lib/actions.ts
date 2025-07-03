'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { MovieProps, FormState, MoviePropsV2, Movies } from '@/app/lib/types'
import { cookies } from 'next/headers';
import { string, z } from 'zod';
import { createClient } from '@/app/utils/supabase/server'
// import supabase from '@/app/utils/supabase/client'


const schema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
});

export async function login(formState: FormState, formData: FormData): Promise<FormState> {

  const supabase = await createClient();

  const data = schema.parse({ email: formData.get('email'), password: formData.get('password') });

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {

    return { error: { message: error.message } };
  }

  const userData = await supabase.auth.getUser()
  await saveCookies(!!userData.data.user || false)

  revalidatePath('/?f=false&page=1', 'layout')
  redirect('/?f=false&page=1')
}

export async function saveCookies(userExists: boolean) {
  (await cookies()).set('user', `${userExists}`)
}

export async function deleteCookies() {
  (await cookies()).delete('user')
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  await deleteCookies()

  if (error) {
    redirect('/error')
  }
  revalidatePath('/?f=false&page=1', 'layout')
  redirect('/?f=false&page=1')
}


export async function signup(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}


export async function searchMovies(title: string): Promise<MovieProps[]> {
  const supabase = await createClient()

  const cleanedTitle = title.replace('', '%') + '%'

  const { data: movies, error } = await supabase
    .from('all_films')
    .select()
    .ilike('title', cleanedTitle)

  if (error) {
    console.error(error)
  }

  return movies || []
}

export async function getMovies(start: number, end: number, filter: boolean): Promise<MovieProps[]> {
  const supabase = await createClient()
  const rpc_ = filter ? 'xor_all_watched' : 'all_films_default'
  const {data: movies, error} = await supabase.rpc(rpc_).range(start,end);

  if (error) {
    console.error(error)
  }

  return movies || []
}

export async function getMovieCount(): Promise<number> {
  const supabase = await createClient();
  const table = 'movies';

  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error(error)
  }

  return count || 0
}


export async function getWatchedMovies(start: number, end: number, count: number): Promise<MoviePropsV2[]> {
  const supabase = await createClient()
  const table = 'watched'

  const select = `
        movie_id,
        favorited,
        method,
        movies (title, release_date, poster_path, backdrop_path, overview)
        `
  if (count === 0) {

    return [] as MoviePropsV2[]
  }

  const { data: movies, error } = (count < 10) ?
    await supabase
      .from(table)
      .select(select).order('watched_at').order('movie_id') :
    await supabase
      .from(table)
      .select(select)
      .range(start, end).order('watched_at').order('movie_id')

  if (error) {
    console.error(error)
  }

  if (movies) {
    return movies.map((item) => {
      return {
        movie_id:  item.movie_id,
        favorited: item.favorited,
        method : item.method,
        movies: (item.movies as unknown) as Movies
      }
    })
  }


  return [] as MoviePropsV2[]
}

export async function getWatchedMovieCount(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('watched')
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error(error)
  }

  return count || 0
}


export async function sqlFunction(movie_id: number, func: number){

  const supabase = await createClient()

  const funcs = ['invert_method', 'invert_favorite', 'insert_watched', 'delete_watched' ]
  
  const { error } = await supabase.rpc(funcs[func], {
    _movie_id: movie_id,
  });
  
  
  if (error) {
    console.error(error)
  }
}


