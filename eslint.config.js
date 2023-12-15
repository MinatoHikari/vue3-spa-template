const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
    {
        ignores: [
            '.idea/',
            '**/.idea/**/',
            '.vscode/',
            '**/.vscode/**/',
            '.fleet/',
            '**/.fleet/**/',
            'node_modules',
            '**/node_modules/**',
            'dist',
            '**/dist/**',
            '.DS_Store',
            '**/.DS_Store/**',
            'auto-import.d.ts',
            '**/auto-import.d.ts/**',
            'components.d.ts',
            '**/components.d.ts/**',
        ],
        stylistic: {
            indent: 4, // 4, or 'tab'
        },
        overrides: {
            vue: {
                'vue/html-indent': ['warn', 4],
                'vue/quote-props': ['error', 'as-needed'],
                'vue/singleline-html-element-content-newline': 'off',
                'vue/component-tags-order': 'off',
                'vue/one-component-per-file': 'off',
                'vue/operator-linebreak': 'off',
                'vue/no-unused-refs': 'off',
            },
            typescript: {
                'ts/semi': 'off',
                'ts/brace-style': 'off',
                'ts/member-delimiter-style': 'off',
                'ts/consistent-type-definitions': 'off',
                'ts/no-unused-vars': 'warn',
                'ts/indent': 'off',
                'ts/no-use-before-define': 'warn',
                'ts/ban-types': [
                    'error',
                    {
                        extendDefaults: true,
                        types: {
                            '{}': false,
                        },
                    },
                ],
            },
            yaml: {
                'yml/indent': ['warn', 4],
            },
            // ...
        },
    },
    {
        rules: {
            'unused-imports/no-unused-vars': 'warn',
            'jsonc/indent': ['warn', 4],
            'no-mixed-operators': 'warn',
            'no-console': 'off',
            'arrow-parens': 'off',
            'operator-linebreak': 'off',
            'space-before-function-paren': 'off',
            'antfu/if-newline': 'off',
            'antfu/generic-spacing': 'off',
            'semi': 'off',
            'quote-props': 'off',
            'curly': 'off',
            'max-statements-per-line': 'off',
            'antfu/top-level-function': 'off',
            'any non-nullish value': 'off',
        },
    },
)
