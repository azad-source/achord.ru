import * as React from 'react';

interface Props {
    className?: string;
}

export const LikeIcon: React.FC<Props> = ({ className }) => {
    return (
        <svg
            version="1.1"
            viewBox="0 0 13 13"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                fill="currentColor"
                d="M9.727273 2.090909c-1.1454548 0-2.1545457.572727-2.727273 1.472727-.5727273-.9-1.5818182-1.472727-2.7272727-1.472727C2.4727273 2.090909 1 3.563636 1 5.363636c0 3.245455 6 6.545455 6 6.545455s6-3.272727 6-6.545455c0-1.8-1.472727-3.272727-3.272727-3.272727z"
            />
        </svg>
    );
};
