import type { Validation, ValidationArgs } from '@vuelidate/core';
import type { Ref } from 'vue';

export const useNFormItem = <
    T extends { [key in keyof Vargs]: any },
    Vargs extends ValidationArgs = ValidationArgs,
>(
        v$: Ref<Validation<Vargs, T>>,
    ) => {
    const getValidationState = (key: keyof Vargs) => {
        if (!v$.value.$anyDirty) return undefined;
        if ((v$.value[key] as Validation).$error) return 'error';
        else return 'success';
    };

    const getFeedback = (key: keyof Vargs) => {
        const validation = v$.value[key] as Validation;
        if (validation && validation.$errors && validation.$errors[0]) {
            return resolveUnref(validation.$errors[0].$message);
        } else return '';
    };

    return {
        getValidationState,
        getFeedback,
    };
};
