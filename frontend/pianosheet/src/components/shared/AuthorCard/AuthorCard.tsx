import * as React from 'react';
import styles from './AuthorCard.scss';
import cn from 'classnames';
import { Link, useParams } from 'react-router-dom';
import { Paths } from 'utils/routes/Paths';
import defaultImg from 'images/default.png';
import { Button } from '../Button/Button';

interface Props {
    className?: string;
    authorName: string;
    authorAlias: string;
    authorPreview?: string;
    firstAuthorletter?: string;
    index?: number;
}

export const AuthorCard: React.FC<Props> = ({
    className,
    authorName,
    authorAlias,
    authorPreview,
    firstAuthorletter,
    index,
}) => {
    const { letter, composerName } = useParams<{ letter: string; composerName: string }>();

    const curLetter = firstAuthorletter ? firstAuthorletter : letter;

    const backgroundImage = authorPreview
        ? 'url(' + authorPreview + ')'
        : 'url(' + defaultImg + ')';

    const path = authorAlias ? Paths.getAuthorPath(curLetter, authorAlias) : '';

    return (
        <Link
            className={cn(styles.root, className)}
            style={{ backgroundImage: backgroundImage }}
            to={path}
        >
            {index && <div className={styles.index}>{index}</div>}
            <div className={styles.authorName}>{authorName}</div>
        </Link>
    );
};

interface AddProps {
    onClick: () => void;
}

export const AuthorCardAdd: React.FC<AddProps> = ({ onClick }) => {
    return <div className={styles.authorAddButton} onClick={onClick}></div>;
};
