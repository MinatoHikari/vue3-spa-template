import type { MaybeRefOrGetter } from '@vueuse/core';
import type { SelectProps } from 'naive-ui';
import { NSelect } from 'naive-ui';
import type { ComponentPublicInstance } from 'vue';
import type { EnhanceRow } from '~/composables/useNTableEnhance/useNTableEnhance';
import { functionRefWrapper } from '~/utils/helper';

export const useEditableSelectCell = <Row extends Record<string, unknown>>(
    rowData: EnhanceRow<Row>,
    key: keyof Row,
) => {
    const itemProps = ref<SelectProps>({});

    const defineItemProps = (props: MaybeRefOrGetter<SelectProps>) => {
        (itemProps.value as SelectProps) = resolveUnref(props);
    };

    const EditableSelectCell = defineComponent({
        props: enhanceTableCommonCellProps,
        emits: { ...enhanceTableCommonCellEmits },
        setup(p, { attrs, emit }) {
            const cm = editableCell({
                row: rowData,
                key,
                component: (valueRef, { setValue, inputRef, handleEffect }) => {
                    return h(NSelect, {
                        size: 'small',
                        defaultValue: rowData[key] as string,
                        ref: functionRefWrapper(inputRef, {
                            changeOnlyWhenVmExist: true,
                            callback: (vm) => {
                                inputRef.value = vm as InstanceType<typeof NSelect>;
                                emit('refUpdate', vm as ComponentPublicInstance);
                            },
                        }),
                        onUpdateValue: (e) => {
                            handleEffect(e, true).then(() => {
                                emit('editingUpdate', false);
                            });
                        },
                        ...(itemProps.value as SelectProps),
                    });
                },
                wrapperProps: {
                    ...attrs,
                },
                revertOnBlur: p.revertOnBlur,
            });

            return () => (p.isEditing ? h(cm) : h('div', {}, [(rowData[key] as string) ?? '']));
        },
    });

    return {
        EditableSelectCell,
        defineItemProps,
    };
};
