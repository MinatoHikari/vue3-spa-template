import {
    helpers,
    decimal as oDecimal,
    maxLength as oMaxLength,
    maxValue as oMaxValue,
    minLength as oMinLength,
    minValue as oMinValue,
    numeric as oNumeric,
    required as oRequired,
    requiredIf as oRequiredIf,
} from '@vuelidate/validators';
import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/core';
import { getByteLength } from '~/utils/toolFunction';

export const useVuelidateRules = () => {
    const { t } = useTypedI18n();

    const required = helpers.withMessage(() => t('validation.common.required'), oRequired);

    const requiredIf = (prop: boolean | string | (() => boolean | Promise<boolean>)) =>
        helpers.withMessage(() => t('validation.common.required'), oRequiredIf(prop));

    const numeric = helpers.withMessage(() => t('validation.common.numeric'), oNumeric);

    const decimal = helpers.withMessage(() => t('validation.common.decimal'), oDecimal);

    const positiveInteger = helpers.withMessage(
        () => t('validation.common.positive_interger'),
        (value: any) => {
            if (value === '') return true;
            return /^(1|[1-9][0-9]*)$/.test(value);
        },
    );
    const maxNumber = (num: MaybeRefOrGetter<number> = 10, message?: MaybeRefOrGetter<string>) =>
        helpers.withMessage(
            () =>
                resolveUnref(message) ||
                t('validation.common.up_to_digits', { number: resolveUnref(num) }),
            (value: any) => {
                if (value === '') return true;
                const regexStr = `(^[0-9]{1,${resolveUnref(
                    num,
                )}}\\.[0-9]{1,2}$)|^[0-9]{1,${resolveUnref(num)}}$`;
                const regex = new RegExp(regexStr);
                return regex.test(value);
            },
        );

    const maxFloat = helpers.withMessage(
        () => t('validation.common.up_to_2_decimal_places'),
        (value: any) => {
            if (value === '') return true;
            return /(^[0-9]{1,10}\.[0-9]{1,2}$)|^[0-9]{1,10}$/.test(value);
        },
    );

    const maxBytes = (num: MaybeRefOrGetter<number>) =>
        helpers.withMessage(
            () => t('validation.common.max_bytes', { number: resolveUnref(num) }),
            (value: unknown) => {
                return getByteLength((value as string | number).toString()) <= resolveUnref(num);
            },
        );

    const maxValue = (max: MaybeRef<number> | MaybeRef<string>) =>
        helpers.withMessage(
            () => t('validation.common.greater_than', { number: resolveUnref(max) }),
            oMaxValue(max),
        );
    const minValue = (min: number) =>
        helpers.withMessage(
            () => t('validation.common.less_than', { number: resolveUnref(min) }),
            oMinValue(min),
        );

    const maxLength = (length: MaybeRef<number>) =>
        helpers.withMessage(
            () => t('validation.common.more_than_characters', { number: resolveUnref(length) }),
            oMaxLength(length),
        );

    const minLength = (length: MaybeRef<number>) =>
        helpers.withMessage(
            () => t('validation.common.less_than_characters', { number: resolveUnref(length) }),
            oMinLength(length),
        );

    const length = (length: MaybeRefOrGetter<number>) =>
        helpers.withMessage(
            () => t('validation.common.must_be_characters', { number: resolveUnref(length) }),
            (value: any) => {
                return value.toString().length === resolveUnref(length);
            },
        );

    return {
        required,
        maxLength,
        minLength,
        requiredIf,
        // asyncExist,
        length,
        positiveInteger,
        maxNumber,
        maxFloat,
        maxBytes,
        numeric,
        decimal,
        minValue,
        maxValue,
    };
};
