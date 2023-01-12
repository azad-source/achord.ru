import { Link } from './Link';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'shared/Input',
    component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
