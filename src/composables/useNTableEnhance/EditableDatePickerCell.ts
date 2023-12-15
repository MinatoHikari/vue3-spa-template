import type { MaybeRefOrGetter } from '@vueuse/core'
import type { DatePickerProps } from 'naive-ui'
import { NDatePicker } from 'naive-ui'
import type { ComponentPublicInstance } from 'vue'
import type { EnhanceRow } from '~/composables/useNTableEnhance/useNTableEnhance'
import { functionRefWrapper } from '~/utils/helper'

export function useEditableDatePickerCell<Row extends Record<string, unknown>>(rowData: EnhanceRow<Row>, key: keyof Row) {
    const itemProps = ref<DatePickerProps>({})

    const defineItemProps = (props: MaybeRefOrGetter<DatePickerProps>) => {
        (itemProps.value as DatePickerProps) = resolveUnref(props)
    }

    const EditableDatePickerCell = defineComponent({
        props: enhanceTableCommonCellProps,
        emits: { ...enhanceTableCommonCellEmits },
        setup(p, { attrs, emit }) {
            const cm = editableCell({
                row: rowData,
                key,
                component: (valueRef, { setValue, inputRef, handleEffect }) => {
                    return h(NDatePicker, {
                        size: 'small',
                        defaultFormattedValue: rowData[key] as string,
                        valueFormat: 'yyyy-MM-dd',
                        ref: functionRefWrapper(inputRef, {
                            changeOnlyWhenVmExist: true,
                            callback: (vm) => {
                                inputRef.value = vm as InstanceType<typeof NDatePicker>
                                emit('refUpdate', vm as ComponentPublicInstance)
                            },
                        }),
                        onUpdateFormattedValue: (e) => {
                            handleEffect(e, false).then(() => {
                                emit('editingUpdate', false)
                            })
                        },
                        ...itemProps.value,
                    })
                },
                wrapperProps: {
                    ...attrs,
                },
                revertOnBlur: p.revertOnBlur,
            })

            return () => (p.isEditing ? h(cm) : h('div', {}, [rowData[key] as string]))
        },
    })

    return {
        EditableDatePickerCell,
        defineItemProps,
    }
}
