import type { Preview } from '@storybook/react';
import { StoryDecorator } from '../src/decorators/StoryDecorator';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [StoryDecorator],
};

export default preview;
