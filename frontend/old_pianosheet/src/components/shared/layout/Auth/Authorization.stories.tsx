import { Authorization } from './Authorization';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'shared/Authorization',
    component: Authorization,
} as ComponentMeta<typeof Authorization>;

const Template: ComponentStory<typeof Authorization> = (args) => (
    <Authorization {...args} />
);

const loginHandler = (
    username: string,
    password: string,
    event: React.FormEvent,
) => {
    event.preventDefault();
    console.log(
        `username: ${username}, password: ${password}, event: ${event}`,
    );
};

const onSwitchForm = (bool: boolean) => console.log('onSwitchForm', bool);

export const Primary = Template.bind({});

Primary.args = {
    loginHandler,
    onSwitchForm,
};
