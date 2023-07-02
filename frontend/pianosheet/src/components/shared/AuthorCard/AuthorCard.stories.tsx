import type { Meta, StoryObj } from '@storybook/react';
import { AuthorCard_ } from './AuthorCard';
import { AuthorListMocks } from 'mockData/allMocks';
import { EditAuthorByIdRequest } from 'redux/models/authorModels';

const meta = {
    title: 'shared/AuthorCard',
    component: AuthorCard_,
    tags: ['autodocs'],
} satisfies Meta<typeof AuthorCard_>;

export default meta;
type Story = StoryObj<typeof meta>;

const handleEditAuthor = (options: EditAuthorByIdRequest): Promise<void> => {
    return new Promise((res) => {
        res();
    });
};

const handleAddToFavorite = () => {
    alert('added to Favorite');
};

const handleRemoveAuthor = () => {
    alert('author is removed');
};

export const Primary: Story = {
    args: {
        author: {
            ...AuthorListMocks[0],
        },
        canAddToFavorite: true,
        canEdit: true,
        isDarkTheme: false,
        isLoading: false,
        onEditAuthor: handleEditAuthor,
        onAddToFavorite: handleAddToFavorite,
        onRemoveAuthor: handleRemoveAuthor,
    },
};

export const IsLoading: Story = {
    args: {
        author: {
            ...AuthorListMocks[0],
        },
        canAddToFavorite: true,
        canEdit: true,
        isDarkTheme: false,
        isLoading: true,
        onEditAuthor: handleEditAuthor,
        onAddToFavorite: handleAddToFavorite,
        onRemoveAuthor: handleRemoveAuthor,
    },
};
