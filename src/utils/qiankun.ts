import { registerMicroApps } from 'qiankun';
import { mode } from '~/main';

const defaultLocale = useStorage('locale', ref('zh-CN'), localStorage, {
    writeDefaults: true,
});

// export const microAppStateActions = initGlobalState({
//     locale: defaultLocale.value,
// });
//
// microAppStateActions.onGlobalStateChange((state, prevState) => {
//     console.log('main app state:', state);
//     // console.log('prevState', prevState);
// });
//
// const getContainer = () => {
//     const container = document.querySelector('#service');
//     console.log(container);
//     return container as HTMLElement;
// };

export const initQiankun = () => {
    registerMicroApps(
        [
            {
                name: 'xxx-service',
                entry: mode === 'development' ? 'http://127.0.0.1:9302/' : '/service/xxx-service/',
                activeRule: '/service/xxx-service',
                container: '#service',
            },
        ],
        {
            beforeLoad: (app: any) => {
                console.log('before load+++++++++++', app.name);
                return Promise.resolve();
            },
            beforeMount: (app: any) => {
                console.log('before mount----------', app.name);
                return Promise.resolve();
            },
            // qiankun 生命周期钩子 - 微应用挂载后
            afterMount: (app: any) => {
                console.log('after mount============', app.name);
                return Promise.resolve();
            },
            afterUnmount: (app: any) => {
                console.log('after unmount===+++++----', app.name);
                return Promise.resolve();
            },
        },
    );
};
