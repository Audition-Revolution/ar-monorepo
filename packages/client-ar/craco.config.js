const {POSTCSS_MODES} = require("@craco/craco");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
module.exports = {
    eslint: {
        "plugins": [
            "cypress"
        ],
        "rules": {
            "no-extend-native": "off",
            "react-hooks/exhaustive-deps": "off"
        }
    },
    webpack: {
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        plugins: [
            // new DynamicCdnWebpackPlugin(),
            new BundleAnalyzerPlugin(),
        ],
        configure: (config) => {
            config.module.rules[2].oneOf.unshift({
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: require.resolve('graphql-tag/loader'),
            });
            config.resolve.alias = {
                'react-dom': path.resolve(path.join(__dirname, '../../node_modules', 'react-dom'))
            };
            config.optimization = {
                splitChunks: {
                    chunks: 'all',
                    minSize: 30 * 1024,
                    maxSize: 512 * 1024
                },
            };
            return config
        }
    }
};
