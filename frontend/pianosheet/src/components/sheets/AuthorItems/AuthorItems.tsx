import { AuthorJsModel } from 'domain/api/JsModels';
import * as React from 'react';
import { AuthorCard } from 'components/shared/AuthorCard/AuthorCard';
import styles from './AuthorItems.scss';
import { Pagination } from 'components/shared/layout/Pagination/Pagination';

interface Props {
    authors: AuthorJsModel;
    pageNumber: number;
    getAuthorsByPage: (page: number) => void;
}

export const AuthorItems: React.FC<Props> = ({ authors, pageNumber, getAuthorsByPage }) => {
    return (
        <>
            <div className={styles.authors}>
                {authors.results.map((author, index) => (
                    <AuthorCard key={index} author={author} className={styles.authors_item} />
                ))}
            </div>
            {authors.page_count > 1 && (
                <Pagination
                    pageCount={authors.page_count}
                    pageNumber={pageNumber}
                    switchPage={getAuthorsByPage}
                />
            )}
        </>
    );
};
