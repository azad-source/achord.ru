import { MenuMobile } from './MenuMobile';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
    title: 'shared/MenuMobile',
    component: MenuMobile,
} as ComponentMeta<typeof MenuMobile>;

const items = [
    { caption: 'Главная', link: '/' },
    { caption: 'Новости', link: '/news' },
    { caption: 'О нас', link: '/about-us' },
];

const Template: ComponentStory<typeof MenuMobile> = (args) => (
    <MenuMobile {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
    items,
    logged: false,
    logout: action('logout'),
};
