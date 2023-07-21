import type { Meta, StoryObj } from '@storybook/react';
import { SheetRow } from './SheetRow';

const meta = {
    title: 'shared/SheetRow',
    component: SheetRow,
    tags: ['autodocs'],
} satisfies Meta<typeof SheetRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const sheetMock = {
    id: 1,
    author: 1,
    favorite: false,
    filename: 'Gold collection.pdf',
    like: false,
    like_count: 1,
    name: 'Abba - Gold collection',
    rate: 10,
    savedate: '',
};

export const Primary: Story = {
    args: {
        sheet: { ...sheetMock },
        index: 0,
    },
};

export const PrimaryWithoutPosition: Story = {
    args: {
        sheet: { ...sheetMock },
        index: 0,
        hidePosition: true,
    },
};

export const Secondary: Story = {
    args: {
        sheet: { ...sheetMock },
        index: 0,
        type: 'second',
    },
};

export const SecondaryWithoutPosition: Story = {
    args: {
        sheet: { ...sheetMock },
        index: 0,
        type: 'second',
        hidePosition: true,
    },
};
