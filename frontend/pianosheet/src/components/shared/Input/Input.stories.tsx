import { Input } from './Input';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'shared/Input',
    component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    autoFocus: true,
    placeholder: 'e-mail',
    type: 'email',
};
