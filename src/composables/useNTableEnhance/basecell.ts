import type { HTMLAttributes, Ref, VNode } from 'vue'
import type { NCheckbox, NDatePicker, NInput, NInputNumber, NSelect } from 'naive-ui'
import type { EnhanceRow } from './useNTableEnhance'

export type SetValue = (val: string | null, updateRow?: boolean) => void

function useEditing<Row = object>(
    hook: () => {
        value: Ref<string | null>
        row: EnhanceRow<Row>
        key: keyof Row
        revertOnBlur?: boolean
        input: Ref<InstanceType<typeof NInput> | null>
        setValue: SetValue
    },
) {
    let rowUpdated = false

    const { row, key, value, input, setValue, revertOnBlur } = hook()

    const formItemRef = ref()

    const effect = async <T>(updateVal: T, updateRow: boolean) => {
        const result = updateVal ?? value.value
        setValue(result as string, updateRow)
        if (updateRow) rowUpdated = true
    }

    const revert = () => {
        const cache = row.valCache?.get(key)
        if (cache) {
            value.value = cache as string
            row[key] = cache as EnhanceRow<Row>[keyof Row]
        }
    }

    onBeforeUnmount(() => {
        if (!rowUpdated && revertOnBlur) revert()
        else effect(value.value, true)
    })

    return {
        formItemRef,
        handleEffect: effect,
    }
}

function useInput<Row extends Record<string, unknown>>(
    hook: () => { row: EnhanceRow<Row>, key: keyof Row },
) {
    const { row, key } = hook()

    let defaultValue = row[key] as string
    if (row.editValCache && row.editValCache.has(key))
        defaultValue = row.editValCache.get(key) as string

    const value = ref<string | null>(defaultValue)
    const input = ref<InstanceType<typeof NInput> | null>(null)

    const effect = (val: string | null, updateRow?: boolean) => {
        if (updateRow) {
            row[key] = val as Row[keyof Row]
            const isEdited = val !== row.originVal
            console.log(isEdited)
            row.editedMap?.set(key, isEdited)
            row.valCache?.set(key, val)
        }
    }

    const setValue: SetValue = (val, updateRow) => {
        let res = val
        if (res === '') res = null
        value.value = res ?? null
        effect(res ?? null, updateRow)
    }

    return {
        value,
        input,
        setValue,
    }
}

function initCache<Row extends Record<string, unknown>>(
    hook: () => {
        row: EnhanceRow<Row>
        key: keyof Row
    },
) {
    const { row, key } = hook()

    if (!row.valCache) row.valCache = new Map()
    if (!row.editValCache) row.editValCache = new Map()
    if (!row.editedMap) row.editedMap = new Map()
    if (!row.valCache?.has(key)) row.valCache?.set(key, row[key])
    if (!row.originVal) row.originVal = row[key]
}

export function editableCell<Row extends Record<string, unknown>>({
    row,
    key,
    component,
    wrapperProps,
    revertOnBlur,
}: {
    row: EnhanceRow<Row>
    key: keyof Row
    component: (
        valueRef: Ref<string | null>,
        props: {
            setValue: SetValue
            inputRef: Ref<InstanceType<
                | typeof NInput
                | typeof NSelect
                | typeof NDatePicker
                | typeof NInputNumber
                | typeof NCheckbox
            > | null>
            handleEffect: <T>(val: T, forceEdit: boolean) => Promise<void>
        },
    ) => VNode
    wrapperProps?: HTMLAttributes
    revertOnBlur?: boolean
}) {
    return defineComponent({
        setup() {
            const { value, input, setValue } = useInput(() => ({ row, key }))

            const { formItemRef, handleEffect } = useEditing(() => ({
                value,
                row,
                key,
                revertOnBlur,
                input,
                setValue,
            }))

            initCache(() => ({
                row,
                key,
            }))

            return () =>
                h(
                    'div',
                    {
                        ref: formItemRef,
                        ...wrapperProps,
                    },
                    [
                        component(value, {
                            setValue,
                            inputRef: input,
                            handleEffect,
                        }),
                    ],
                )
        },
    })
}
