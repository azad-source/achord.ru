import * as React from 'react';

interface Props {
    className?: string;
}

export const FacebookIcon: React.FC<Props> = ({ className }) => {
    return (
        <svg
            version="1.1"
            viewBox="0 0 200 200"
            width="25"
            height="25"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            className={className}
        >
            <rect
                transform="matrix(.78 0 0 .78 200 200)"
                fill="currentColor"
                height="258"
                width="258"
                rx="28"
                y="-257.205"
                x="-257.205"
            />
            <path
                fill="#fff"
                d="M64.9 82.06h21.06v-3.9c0-6.24-.78-14.04 0-20.28.78-14.82 8.58-24.18 28.86-24.96l20.28.78v21.84c-8.58 0-23.4-3.12-24.96 7.8v18.72h23.4l-2.34 24.18h-21.06v60.84H85.96v-60.84l-21.06-.78v-23.4z"
            />
            <path
                fill="currentColor"
                d="M200.35 99.11l-65.52-65.52v21.84c-8.58 0-23.4-3.12-24.96 7.8v18.72h23.4l-2.34 24.18h-21.06v60.84H85.69l33.54 33.54h59.28l21.84-21.84V99.11z"
            />
        </svg>
    );
};
