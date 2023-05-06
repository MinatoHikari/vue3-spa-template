import type { MaybeRefOrGetter } from '@vueuse/core';
import type { InputProps } from 'naive-ui';
import { NInput } from 'naive-ui';
import type { ComponentPublicInstance } from 'vue';
import type { EnhanceRow } from '~/composables/useNTableEnhance/useNTableEnhance';
import { functionRefWrapper } from '~/utils/helper';

export const useEditableInputCell = <Row extends Record<string, unknown>>(
    rowData: EnhanceRow<Row>,
    key: keyof Row,
) => {
    const itemProps = ref<InputProps>({});

    const defineItemProps = (props: MaybeRefOrGetter<InputProps>) => {
        (itemProps.value as InputProps) = resolveUnref(props);
    };

    const EditableInputCell = defineComponent({
        props: enhanceTableCommonCellProps,
        emits: {
            ...enhanceTableCommonCellEmits,
        },
        setup(p, { attrs, emit }) {
            const cm = editableCell({
                row: rowData,
                key,
                component: (valueRef, { setValue, inputRef, handleEffect }) => {
                    return h(NInput, {
                        size: 'small',
                        defaultValue: rowData[key] as string,
                        ref: functionRefWrapper(inputRef, {
                            changeOnlyWhenVmExist: true,
                            callback: (vm) => {
                                inputRef.value = vm as InstanceType<typeof NInput>;
                                emit('refUpdate', vm as ComponentPublicInstance);
                            },
                        }),
                        onUpdateValue: (v) => {
                            handleEffect(v, false);
                        },
                        onKeyup: (e) => {
                            if (e.key === 'Enter') {
                                handleEffect(undefined, true).then(() => {
                                    emit('editingUpdate', false);
                                });
                            }
                        },
                        ...(itemProps.value as InputProps),
                    });
                },
                wrapperProps: {
                    ...attrs,
                },
                revertOnBlur: p.revertOnBlur,
            });

            return () => (p.isEditing ? h(cm) : h('div', {}, [rowData[key] as string]));
        },
    });

    return {
        EditableInputCell,
        defineItemProps,
    };
};
