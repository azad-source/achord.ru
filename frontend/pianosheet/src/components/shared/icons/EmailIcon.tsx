import * as React from 'react';

interface Props {
    className?: string;
}

export const EmailIcon: React.FC<Props> = ({ className }) => {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 150"
            width="25"
            height="25"
            className={className}
        >
            <path
                fill="#fff"
                d="M0 24.75v125h200v-125l-100 62.5L0 24.75zm0-12.5l100 62.5 100-62.5V-.25H0v12.5z"
            />
        </svg>
    );
};
