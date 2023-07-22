import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta = {
    title: 'shared/Pagination',
    component: Pagination,
    tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        pageCount: 10,
        pageNumber: 2,
    },
};

export const SmallSize: Story = {
    args: {
        pageCount: 10,
        pageNumber: 2,
        size: 'small',
    },
};
