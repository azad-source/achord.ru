import { Registration } from './Registration';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'shared/Registration',
    component: Registration,
} as ComponentMeta<typeof Registration>;

const Template: ComponentStory<typeof Registration> = (args) => (
    <Registration {...args} />
);

const onSwitchForm = (bool: boolean) => console.log('onSwitchForm', bool);

const registerHandler = (
    email: string,
    password: string,
    event: React.FormEvent,
): Promise<void> => {
    event.preventDefault();
    console.log(`email: ${email}, password: ${password}, event: ${event}`);

    return new Promise((res) => res);
};

export const Primary = Template.bind({});

Primary.args = {
    onSwitchForm,
    registerHandler,
};
