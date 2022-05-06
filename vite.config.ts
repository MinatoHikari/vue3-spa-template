/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Layouts from 'vite-plugin-vue-layouts';
import Unocss from 'unocss/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    resolve: {
        alias: {
            '~/': `${path.resolve(__dirname, 'src')}/`,
        },
    },
    server: {
        proxy: {
            '/api/': {
                target: 'http://www.example.com/',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            },
        },
    },
    plugins: [
        Vue({
            reactivityTransform: true,
        }),

        vueJsx({
            // options are passed on to @vue/babel-plugin-jsx
        }),

        // https://github.com/hannoeru/vite-plugin-pages
        Pages(),

        Layouts(),

        // https://github.com/antfu/unplugin-auto-import
        AutoImport({
            imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
            dts: true,
        }),

        // https://github.com/antfu/vite-plugin-components
        Components({
            dts: true,
            resolvers: [NaiveUiResolver()],
        }),

        // https://github.com/antfu/unocss
        // see unocss.config.ts for config
        Unocss(),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
        environment: 'jsdom',
    },
});
