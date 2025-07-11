'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { MovieProps } from '@/app/lib/types'

const style = {
    // Root class for the input field
    "& .MuiOutlinedInput-root": {
        color: "#fafafa",
        fontFamily: "Arial",
        flexWrap: 'nowrap !important',
        // Class for the border around the input field
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fafafa",

        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `#821616`,
        },

        "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#821616",
                borderWidth: 1
            },
        },

    },

    // Class for the label of the input field
    "& .MuiInputLabel-root": {
        // right: 0,
        color: "#fafafa",
        textAlign: 'center',

        "& .MuiInputLabel-outlined": {

        },
    }

}


export default function MovieSelect({ MovieData }: { MovieData: MovieProps[] }) {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [myValue, setValue] = React.useState<MovieProps | null>(null);


    const handleSearch = useDebouncedCallback((term) => {

        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`)
    }, 600)


    return (
        <Autocomplete
            freeSolo
            loading
            id="free-solo"
            sx={{ width: 200 }}
            size='small'
            value={myValue}
            options={MovieData}

            // onChange={(e, value: MovieProps | null | string) => {
            //     const val = e.target as HTMLTextAreaElement
            //     if(typeof value == 'object'){
            //         setValue(value)
            //         return;
            //     }
            //     handleSearch(val?.value)
            //     // }
            //     // handleSearch(value);
            // }}
            // onInputChange={(e, value) => {
            //     if (typeof value == 'object') {
            //         setValue(value)
            //         handleSearch(myValue?.title);
            //         return;
            //     }
            //     const val = e.target as HTMLTextAreaElement
            //     handleSearch(val?.title);
            // }}

            renderInput={(params) => (
                <TextField
                    {...params}
                    sx={style}
                    label="Search Movie"
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        },
                    }}
                />
            )}

            renderOption={(props, option: MovieProps) => {
                const { key, ...optionProps } = props;

                return (
                    <Box
                        key={key}
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        <div onClick={() => console.log(option.title)}>

                            <img
                                loading="lazy"
                                width="40"
                                srcSet={`${imageBaseUrl}${option.poster_path}`}
                                src={`${imageBaseUrl}${option.poster_path}`}
                                alt=""
                            />
                            {option.title}
                        </div>
                    </Box>
                );
            }}

        >
        </Autocomplete>

    );
}
