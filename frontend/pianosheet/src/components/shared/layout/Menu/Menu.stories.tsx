import { Menu } from './Menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
    title: 'shared/Menu',
    component: Menu,
} as ComponentMeta<typeof Menu>;

const items = [
    { caption: 'Главная', link: '/' },
    { caption: 'Новости', link: '/news' },
    { caption: 'О нас', link: '/about-us' },
];

const Template: ComponentStory<typeof Menu> = (args) => <Menu {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    items,
    logged: false,
    logout: action('logout'),
};
