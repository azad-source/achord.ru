import * as React from 'react';
import { SpinnerEllipsis } from '../SpinnerEllipsis/SpinnerEllipsis';
import { SpinnerGrid } from '../SpinnerGrid/SpinnerGrid';
import { SpinnerMusic } from '../SpinnerMusic/SpinnerMusic';

export type SpinnerType = 'grid' | 'ellipsis' | 'music';
interface Props {
    type?: SpinnerType;
    withBackground?: boolean;
}

export const Spinner: React.FC<Props> = ({ type = 'music', ...props }) => {
    let spinner = <SpinnerGrid />;

    switch (type) {
        case 'ellipsis':
            spinner = <SpinnerEllipsis {...props} />;
            break;
        case 'music':
            spinner = <SpinnerMusic {...props} />;
            break;
        case 'grid':
            spinner = <SpinnerGrid {...props} />;
            break;
    }

    return spinner;
};
