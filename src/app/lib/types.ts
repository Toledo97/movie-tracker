// props

import React from 'react';

export interface MovieProps {
    title: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    movie_id: number;
    watched?: boolean;
    favorited?: boolean;
    method?: boolean;
    rating: number;
    watched_at?: string;
}

export interface GallaryProps {
    title: string;
    total: number;
}

export interface ButtonProps extends React.PropsWithChildren {
    handleAction?: () => void;
    title?: string;
    baseColor?: string;
    textColor?: string;
}

export interface PaginationProps extends React.PropsWithChildren {
    handleAction?: () => void;
    title?: string;
    page: number;
}

export type Errors = {
    email?: string;
    password?: string;
    message?: string
};
export type FormState = {
    error: Errors;
};

export type Movies = {
    title: string;
    release_date: string;
    poster_path?: string;
    backdrop_path?: string;
    overview: string;
};

export type MovieType = {
    title: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    movie_id: number;
    watched?: boolean;
    favorited?: boolean;
    method?: boolean;
    rating?: number;
    watched_at?: string;
}