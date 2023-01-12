import * as React from 'react';

interface Props {
    className?: string;
}

export const TelegramIcon: React.FC<Props> = ({ className }) => {
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            className={className}
        >
            <path
                fill="currentColor"
                d="M24.388 2.919l-3.746 19.126s-.161.874-1.245.874c-.576 0-.873-.274-.873-.274l-8.114-6.733-3.97-2.001-5.095-1.355s-.907-.262-.907-1.012c0-.625.933-.923.933-.923l21.316-8.468c-.001-.001.651-.235 1.126-.234.292 0 .625.125.625.5 0 .25-.05.5-.05.5z"
            />
            <path
                fill="currentColor"
                d="M13.438 18.424l-3.426 3.374s-.149.115-.348.12c-.069.002-.143-.009-.219-.043l.964-5.965 3.029 2.514z"
            />
            <path
                fill="#aaa"
                d="M20.335 6.115a.5.5 0 0 0-.701-.093L6.438 13.919l2.427 6.912c.322 1.021.58 1.045.58 1.045l.964-5.965 9.832-9.096a.5.5 0 0 0 .094-.7z"
            />
        </svg>
    );
};
