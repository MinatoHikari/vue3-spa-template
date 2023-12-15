import type { Ref } from 'vue'
import type { DatePickerProps } from 'naive-ui'
import TwinDatePicker from '~/components/TwinDatePicker.vue'

export function useTwindatePicker() {
    const twindatePicker = <T>(
        formData: Ref<T>,
        startKey: keyof T,
        endKey: keyof T,
        size?: DatePickerProps['size'],
        valueFormat?: DatePickerProps['valueFormat'],
        defaultTime?: DatePickerProps['defaultTime'],
    ) => {
        return () => {
            return h(TwinDatePicker, {
                'formattedValue': [
                    formData.value[startKey] as string | null,
                    formData.value[endKey] as string as string | null,
                ],
                'onUpdate:formatted-value': (arr) => {
                    (formData.value[startKey] as string | null) = arr[0];
                    (formData.value[endKey] as string | null) = arr[1]
                },
                'size': size || 'small',
                'valueFormat': valueFormat || 'yyyy-MM-dd HH:mm:ss',
                'defaultTime': defaultTime || ['00:00:00', '23:59:59'],
            })
        }
    }

    return {
        twindatePicker,
    }
}
