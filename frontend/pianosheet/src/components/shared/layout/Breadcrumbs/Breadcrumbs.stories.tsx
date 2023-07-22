import { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbProps, Breadcrumbs } from './Breadcrumbs';
import { Paths } from 'utils/routes/Paths';

const meta = {
    title: 'shared/Breadcrumbs',
    component: Breadcrumbs,
    tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

const breadcrumbs: BreadcrumbProps[] = [
    { caption: 'Ноты', link: Paths.sheetsPage },
    { caption: 'A', link: Paths.getLetterPath('A') },
    { caption: 'Abba' },
];

export const Primary: Story = {
    args: {
        items: breadcrumbs,
    },
};
