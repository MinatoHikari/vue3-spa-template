import { readFileSync } from 'node:fs';
import { sep } from 'node:path';
import { parse } from '@vue/compiler-sfc';
import { createLogger } from 'vite';

export type Options = {
    dir: string;
};

export default function ComponentName(options: Options) {
    const { dir } = options;
    return {
        name: 'vite-plugin-component-name',
        resolveId(id: string) {
            return null;
        },
        async transform(src, id: string) {
            const prefix = dir.split(sep).join('/');
            const originId = id;
            id = id.split(sep).join('/');

            if (id.endsWith('.vue') && id.startsWith(prefix) && !id.includes('/modules/')) {
                const camelcase = (await import('camelcase')).default;
                let nameStr = id.split(prefix)[1];

                if (id.endsWith('index.vue')) nameStr = nameStr.split('/index.vue')[0];
                else nameStr = nameStr.split('.vue')[0];

                const idComponentName = camelcase(nameStr.replaceAll('/', '-'), {
                    pascalCase: true,
                    preserveConsecutiveUppercase: true,
                });
                const buffer = readFileSync(originId);
                const attrs = parse(String(buffer)).descriptor.scriptSetup?.attrs;

                if (!(attrs && attrs.name && attrs.name === idComponentName)) {
                    const logger = createLogger();
                    logger.error(`[组件名不存在/不正确]:${id}`);
                    logger.info(`[正确名称]:${idComponentName}`);
                }
            }
            // if (base64) {
            //     return {
            //         code: `export default "${base64}"`,
            //         map: null,
            //     };
            // }
        },
    };
}
