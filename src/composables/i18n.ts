import type enUS from '../../locales/en-US';

export type MessageSchema = typeof enUS;

export enum Locales {
    enUS = 'en-US',
    zhCN = 'zh-CN',
    deDE = 'de-DE',
    frFR = 'fr-FR',
}

export const useTypedI18n = () => {
    return useI18n<[MessageSchema], Locales>();
};

export const useLocalI18n = () => {
    const i18n = useI18n({
        useScope: 'local',
    });

    return {
        i18n,
        mergeMessages: (locales: Parameters<typeof i18n.mergeLocaleMessage>[]) => {
            locales.forEach((locale) => {
                i18n.mergeLocaleMessage(...locale);
            });
        },
    };
};
