'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { MovieProps, FormState } from '@/app/lib/types'
import { cookies } from 'next/headers';
import { string, z } from 'zod';
import { createClient } from '@/app/utils/supabase/server'

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

  revalidatePath('/?f=1&page=1', 'layout')
  redirect('/?f=1&page=1')
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
  revalidatePath('/?f=1&page=1', 'layout')
  redirect('/?f=1&page=1')
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
  const supabase = await createClient();

  const cleanedTitle = `%${title.replace('', '%')}%`;

  const { data: movies, error } = await supabase
    .rpc('all_films_default')
    .ilike('title', cleanedTitle);

  if (error) {
    console.error(error);
  }

  return movies || []
}

export async function getMovies(start: number, end: number, filter: number): Promise<MovieProps[]> {
  const supabase = await createClient()
  const rpc_ = filter == 0 ? 'xor_all_watched' : 'all_films_default'
  const {data: movies, error} = await supabase.rpc(rpc_).range(start, end);

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


export async function getWatchedMovies(start: number, end: number, count: number, orderBy: number): Promise<MovieProps[]> {
  const supabase = await createClient();
  const rpc_ = 'watched_films';
  const orderOpt = ['watched_at', 'title'];

  const { data: movies, error } = (count < 10) ?
    await supabase.rpc(rpc_).order(orderOpt[orderBy], {ascending: false}) :
    await supabase.rpc(rpc_).range(start, end).order(orderOpt[orderBy], {ascending: false});

  if (error) {
    console.error(error);
  }

  return movies || []

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


export async function sqlActionFunc(movie_id: number, func: number, rating?: number){

  const supabase = await createClient()

  const funcs = ['invert_method', 'invert_favorite', 'insert_watched', 'delete_watched', 'update_rating' ]
  
  const { error } = await supabase.rpc(funcs[func], {
    _movie_id: movie_id,
    _rating: rating
  });
  
  
  if (error) {
    console.error(error)
  }
}

export async function statActionFunc(){
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("total_average_rating");
  if (error) {
    console.error(error)
  }
  
  return data
}
