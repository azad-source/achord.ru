const path = require('path');

module.exports = {
    stories: ['../src/**/*.stories.@(tsx|mdx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-actions',
    ],
    webpackFinal: async (config, { configType }) => {
        config.resolve.modules = [
            ...(config.resolve.modules || []),
            path.resolve(__dirname, '../src'),
        ];

        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../'),
        });

        return config;
    },
};
