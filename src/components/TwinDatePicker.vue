import NDatePicker from 'naive-ui';
<script setup lang="ts">
import type { DatePickerProps } from 'naive-ui'
import { datePickerProps } from 'naive-ui'
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: datePickerProps.size,
        default: 'medium',
    },
    value: {
        type: [Array, null] as PropType<Array<number | null>>,
        default: () => [null, null],
    },
    formattedValue: {
        type: [Array, null] as PropType<Array<string | null>>,
        default: () => [null, null],
    },
    defaultTime: {
        type: datePickerProps.defaultTime,
        default: [null, null],
    },
    valueFormat: {
        type: datePickerProps.valueFormat,
        default: 'yyyy-MM-dd',
    },
    startProps: {
        type: Object as PropType<
            Omit<DatePickerProps, 'size' | 'value' | 'formattedValue' | 'type' | 'valueFormat'>
        >,
    },
    type: {
        type: String as PropType<'date' | 'datetime' | 'daterange' | 'month' | 'year' | 'quarter'>,
        default: 'date',
    },
    endProps: {
        type: Object as PropType<
            Omit<DatePickerProps, 'size' | 'value' | 'formattedValue' | 'type' | 'valueFormat'>
        >,
    },
})

const emits = defineEmits<{
    (e: 'update:formatted-value', arr: Array<string | null>): void
    (e: 'update:value', arr: Array<number | null>): void
}>()

function handleValueChange(value: number, index: 0 | 1) {
    const res = [...props.value]
    res[index] = value
    emits('update:value', res)
}

function handleFormattedValueChange(value: string, index: 0 | 1) {
    const res = [...props.formattedValue]
    res[index] = value
    emits('update:formatted-value', res)
}

const { disabledEndDate, disabledEndTime, disabledStartDate, disabledStartTime }
    = useTwinDatePickerDisabledBase(computed(() => props.formattedValue))
</script>

<template>
    <div flex items-center>
        <NDatePicker
            :size="props.size"
            :formatted-value="props.formattedValue[0]"
            :default-time="props.defaultTime[0]"
            :on-update:formatted-value="(v) => handleFormattedValueChange(v, 0)"
            :on-update-value="(v) => handleValueChange(v, 0)"
            :is-date-disabled="disabledStartDate"
            :is-time-disabled="disabledStartTime"
            clearable
            :type="props.type"
            :value-format="valueFormat"
            v-bind="props.startProps"
        />
        <span h-full inline-block m="x-1">-</span>
        <NDatePicker
            :size="props.size"
            :formatted-value="props.formattedValue[1]"
            :default-time="props.defaultTime[1]"
            :on-update:formatted-value="(v) => handleFormattedValueChange(v, 1)"
            :on-update-value="(v) => handleValueChange(v, 1)"
            :is-date-disabled="disabledEndDate"
            :is-time-disabled="disabledEndTime"
            clearable
            :type="props.type"
            :value-format="valueFormat"
            v-bind="props.endProps"
        />
    </div>
</template>
