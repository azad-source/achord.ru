import * as React from 'react';
import styles from './FavoriteIcon.scss';

interface Props {
    className?: string;
    active?: boolean;
}

export const FavoriteIcon: React.FC<Props> = ({ className, active = false }) => {
    return (
        <svg
            version="1.1"
            viewBox="0 0 35 35"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                className={styles.root}
                fill={active ? '#ffd000' : '#fff'}
                strokeWidth={active ? 0 : 2}
                stroke="#3d446b"
                d="M12.2 4.4C10.4 8.3 9.5 9 6.3 9.5c-7.6 1.3-8.1 2.4-3.2 8 2.8 3.1 3.1 4.1 2.6 7.7-.9 7 1.3 8.7 6.3 4.8 3.1-2.5 4.9-2.5 8 0 5 3.9 7.2 2.2 6.3-4.8-.5-3.6-.2-4.6 2.6-7.8 4.3-4.8 3.8-6.7-2.2-7.8-4.4-.8-5-1.2-7-5.2C18.5 1.9 16.9 0 16 0s-2.5 1.9-3.8 4.4z"
            />
        </svg>
    );
};
