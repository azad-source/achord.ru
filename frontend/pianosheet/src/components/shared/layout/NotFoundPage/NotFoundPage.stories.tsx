import { NotFoundPage } from './NotFoundPage';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'shared/NotFoundPage',
    component: NotFoundPage,
} as ComponentMeta<typeof NotFoundPage>;

const Template: ComponentStory<typeof NotFoundPage> = (args) => (
    <NotFoundPage {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
