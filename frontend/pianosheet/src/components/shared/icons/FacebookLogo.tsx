import * as React from 'react';

interface Props {
    className?: string;
}

export const FacebookLogo: React.FC<Props> = ({ className }) => {
    return (
        <svg
            enableBackground="new 73 0 267 266.9"
            version="1.1"
            viewBox="73 0 267 266.9"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M321.1,262.3c7.9,0,14.2-6.4,14.2-14.2V18.8c0-7.9-6.4-14.2-14.2-14.2H91.8  C84,4.6,77.6,11,77.6,18.8v229.3c0,7.9,6.4,14.2,14.2,14.2H321.1z"
                fill="#157DC3"
            />
            <path
                d="m255.4 262.3v-99.8h33.5l5-38.9h-38.5v-24.8c0-11.3 3.1-18.9 19.3-18.9h20.6v-34.9c-3.6-0.5-15.8-1.5-30-1.5-29.7 0-50 18.1-50 51.4v28.7h-33.6v38.9h33.6v99.8h40.1z"
                fill="#fff"
            />
        </svg>
    );
};
