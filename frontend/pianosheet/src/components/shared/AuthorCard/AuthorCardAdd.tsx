import * as React from 'react';
import styles from './AuthorCardAdd.scss';
import cn from 'classnames';
import { Button } from 'components/shared/Button/Button';

interface Props {
    className?: string;
    openModal: () => void;
}

export const AuthorCardAdd: React.FC<Props> = ({ className, openModal }) => {
    return <Button className={cn(styles.root, className)} onClick={openModal}></Button>;
};
