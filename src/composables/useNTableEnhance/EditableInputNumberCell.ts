import type { MaybeRefOrGetter } from '@vueuse/core'
import type { InputNumberProps } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import type { ComponentPublicInstance } from 'vue'
import type { EnhanceRow } from '~/composables/useNTableEnhance/useNTableEnhance'
import { functionRefWrapper } from '~/utils/helper'

export function useEditableInputÏCell<Row extends Record<string, unknown>>(rowData: EnhanceRow<Row>, key: keyof Row) {
    const itemProps = ref<InputNumberProps>({})

    const defineItemProps = (props: MaybeRefOrGetter<InputNumberProps>) => {
        (itemProps.value as InputNumberProps) = resolveUnref(props)
    }

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
                    return h(NInputNumber, {
                        size: 'small',
                        defaultValue: rowData[key] as number,
                        ref: functionRefWrapper(inputRef, {
                            changeOnlyWhenVmExist: true,
                            callback: (vm) => {
                                inputRef.value = vm as InstanceType<typeof NInputNumber>
                                emit('refUpdate', vm as ComponentPublicInstance)
                            },
                        }),
                        onUpdateValue: (v) => {
                            handleEffect(v, false)
                        },
                        onKeyup: (e) => {
                            if (e.key === 'Enter') {
                                handleEffect(undefined, true).then(() => {
                                    emit('editingUpdate', false)
                                })
                            }
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
        EditableInputCell,
        defineItemProps,
    }
}
