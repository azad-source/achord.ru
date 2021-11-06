import * as React from 'react';
import { Toggle } from './Toggle';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'shared/Toggle',
    component: Toggle,
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => {
    const [position, setPosition] = React.useState<'left' | 'right'>('left');

    const onChange = () => {
        setPosition((prev) => (prev === 'left' ? 'right' : 'left'));
    };

    return <Toggle {...args} onChange={onChange} position={position} items={['EN', 'RU']} />;
};

export const Primary = Template.bind({});
