'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { MovieProps, FormState, Errors } from '@/app/lib/types'
import { createClient } from '@/app/utils/supabase/server'
import { cookies } from 'next/headers';
import { string, z } from 'zod';


const schema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
});

export async function login(formState: FormState, formData: FormData): Promise<FormState> {

  const supabase = await createClient();


  const data = schema.parse({ email: formData.get('email'), password: formData.get('password') });
  console.log("Valid email:", data.email);
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: { message: error.message } };
  }

  const userData = await supabase.auth.getUser()
  await saveCookies(!!userData.data.user || false)
  revalidatePath('/?table=0&page=1', 'layout')
  redirect('/?table=0&page=1')
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
  revalidatePath('/?table=0&page=1', 'layout')
  redirect('/?table=0&page=1')
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


export async function getMovies(start: number, end: number, table: string): Promise<MovieProps[]> {
  const supabase = await createClient()

  const { data: movies, error } = await supabase
    .from(table)
    .select()
    .range(start, end)

  if (error) {
    console.error(error)
  }

  return movies || []
}

export async function getMovieCount(table: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error(error)
  }

  return count || 0
}


export async function getWatchedMovies(start: number, end: number, count: number): Promise<MovieProps[]> {
  const supabase = await createClient()
  const table = 'watched_films'

  if (count === 0) {
    return [] as MovieProps[]
  }

  const { data: movies, error } = (count < 10) ?
    await supabase
      .from(table)
      .select() :
    await supabase
      .from(table)
      .select()
      .range(start, end)

  if (error) {
    console.error(error)
  }
  return movies || [] as MovieProps[]

}

export async function getWatchedMovieCount(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('watched_films')
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error(error)
  }

  return count || 0
}

export async function setWatched(movie_id: number) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('insert_watched', {
    movie_id: movie_id,
  });


  if (error) {
    console.error(error)
  }
}

export async function editWatchedMethod(movie_id: number) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('invert_method', {
    _movie_id: movie_id,
  });


  if (error) {
    console.error(error)
  }
}


export async function removeWatched(movie_id: number) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('delete_watched', {
    _movie_id: movie_id,
  });

  if (error) {
    console.error(error)
  }
}

