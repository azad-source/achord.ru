import { Breadcrumbs } from './Breadcrumbs';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'shared/Breadcrumbs',
    component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
    <Breadcrumbs {...args} />
);

const items = [
    { caption: 'раздел', link: '/section' },
    { caption: 'подраздел', link: '/sub-section' },
    { caption: 'текущая страница', link: '/current-page' },
];

export const Primary = Template.bind({});

Primary.args = {
    items,
};
