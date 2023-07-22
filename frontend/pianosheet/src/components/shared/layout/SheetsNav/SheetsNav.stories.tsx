import { Meta, StoryObj } from '@storybook/react';
import { SheetsNav } from './SheetsNav';

const meta = {
    title: 'shared/SheetsNav',
    component: SheetsNav,
    tags: ['autodocs'],
} satisfies Meta<typeof SheetsNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
