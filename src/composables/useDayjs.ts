import dayJs from 'dayjs';
import { customRef } from 'vue';
import type { Locales } from '~/composables/i18n';

export type DateSource = string | number | dayJs.Dayjs | Date | null | undefined;

const dayjsLocaleRef = customRef<string>((track, trigger) => {
    return {
        get: () => {
            track();
            return dayJs.locale();
        },
        set: (locale) => {
            dayJs.locale((locale as Locales).toLowerCase());
            trigger();
        },
    };
});

/** 注意, NDatePicker 默认的时间戳为毫秒单位，用 dayJs.value(t) 转换，非毫秒单位的时间戳用 localeDayJs.value.unix(t) 转换(fromUnix) */
export const useDayJs = () => {
    const localeDayJs = computedWithControl(
        () => dayjsLocaleRef.value,
        () => dayJs,
    );

    const fromUnix = (t: number) => localeDayJs.value.unix(t);

    const toUnix = (date?: DateSource) => localeDayJs.value(date).unix();

    const format = (date?: DateSource, template?: string) =>
        localeDayJs.value(date).format(template);

    const utcFormat = (date?: DateSource, template?: string) =>
        localeDayJs.value(date).utc().format(template);

    const formatYMD = (date?: DateSource) => format(date, 'YYYY-MM-DD');

    const fromUnixFormatYMD = (t: number) => formatYMD(fromUnix(t));

    const utcFormatYMD = (date?: DateSource) => utcFormat(date, 'YYYY-MM-DD');

    const fromUnixUtcFormatYMD = (t: number) => utcFormat(fromUnix(t));

    const formatYMDHMS = (date?: DateSource) => format(date, 'YYYY-MM-DD HH:mm:ss');

    const fromUnixFormatYMDHMS = (t: number) => formatYMDHMS(fromUnix(t));

    const utcFormatYMDHMS = (date?: DateSource) => utcFormat(date, 'YYYY-MM-DD HH:mm:ss');

    const fromUnixUtcFormatYMDHMS = (t: number) => utcFormatYMDHMS(fromUnix(t));

    return {
        dayJs: localeDayJs,
        /**
         * 把 unix 时间戳转换成 dayjs 对象 */
        fromUnix,
        /**
         * 把传入的参数转换成 unix 时间戳 */
        toUnix,
        /**
         * 格式化传入参数 */
        format,
        /**
         * 0时区格式化传入参数 */
        utcFormat,
        /**
         * 格式化传入参数为 YYYY-MM-DD */
        formatYMD,
        /**
         * 0时区格式化传入参数为 YYYY-MM-DD */
        utcFormatYMD,
        /**
         * 格式化传入参数为 YYYY-MM-DD HH:mm:ss */
        formatYMDHMS,
        /**
         * 0时区格式化传入参数为 YYYY-MM-DD HH:mm:ss */
        utcFormatYMDHMS,
        fromUnixFormatYMD,
        fromUnixUtcFormatYMD,
        fromUnixFormatYMDHMS,
        fromUnixUtcFormatYMDHMS,
    };
};

export const setDayjsLocale = (locale: Locales) => {
    dayjsLocaleRef.value = locale;
};
