import { Meta, StoryObj } from '@storybook/react';
import { SearchField } from './SearchField';
import React from 'react';

const meta = {
    title: 'shared/SearchField',
    component: SearchField,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: 400, border: '1px solid #ccc', padding: 15 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchStart: Story = {
    args: {
        isSuccess: false,
        query: 'Abba',
    },
};

export const SearchEnd: Story = {
    args: {
        isSuccess: true,
        query: 'Abba',
    },
};
