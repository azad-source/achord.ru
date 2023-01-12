import { Button } from './Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
    title: 'shared/Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
    <Button {...args}>Push Me</Button>
);

export const Primary = Template.bind({});

Primary.args = {
    use: 'default',
    children: 'Push Me',
    onClick: action('onClick'),
    disabled: false,
};
