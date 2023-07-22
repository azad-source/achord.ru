import { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { MenuItemType } from '../Header/Header';
import { Paths } from 'utils/routes/Paths';
import { SwitchThemeToggle } from 'components/shared/SwitchThemeToggle/SwitchThemeToggle';
import React from 'react';

const meta = {
    title: 'shared/Menu',
    component: Menu,
    tags: ['autodocs'],
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

const menuItems: MenuItemType[] = [
    { caption: 'Главная', link: Paths.mainPage },
    { caption: 'Ноты', link: Paths.sheetsPage },
    { caption: 'Войти', link: '/sign-in' },
    { caption: <SwitchThemeToggle /> },
];

export const Primary: Story = {
    args: {
        items: menuItems,
    },
};
