import { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';
import React from 'react';

const meta = {
    title: 'shared/Loader',
    component: Loader,
    tags: ['autodocs'],
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

const childrenElement = (isDark = false) => (
    <div
        style={{
            height: 400,
            border: '1px solid #333',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 100,
            fontSize: 20,
            lineHeight: 1.5,
            color: isDark ? '#aaa' : '#222',
            backgroundColor: isDark ? '#333' : '#fff',
        }}
    >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex aliquam ratione tempora a
        suscipit, nulla illo reprehenderit voluptates explicabo culpa! Cum quidem ullam officia est
        adipisci eos aliquid quam sed?
    </div>
);

export const Primary: Story = {
    args: {
        children: childrenElement(),
        isLoading: true,
    },
};

export const SpinnerEllipsis: Story = {
    args: {
        children: childrenElement(true),
        isLoading: true,
        spinnerType: 'ellipsis',
    },
};

export const SpinnerGrid: Story = {
    args: {
        children: childrenElement(),
        isLoading: true,
        spinnerType: 'grid',
    },
};
