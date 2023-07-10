import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const aliases = {
    '@core': path.resolve(__dirname, './src/core'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@components': path.resolve(__dirname, './src/components'),
};

const resolveAliases = {
    alias: [
        {
            find: '@vue/runtime-core',
            replacement: '@vue/runtime-core/dist/runtime-core.esm-bundler.js',
        },
    ],
};

const mergedAliases = {
    alias: {
        ...aliases,
        ...resolveAliases.alias.reduce((acc, curr) => {
            acc[curr.find] = curr.replacement;
            return acc;
        }, {}),
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    includeAbsolute: false,
                },
            },
        }),
    ],
    css: {
        preprocessorOptions: {
            sass: {},
        },
    },
    resolve: mergedAliases,
});
