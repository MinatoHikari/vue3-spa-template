import type { Ref } from 'vue'

export function useTwinDatePickerDisabledBase(dateRef: Ref<(string | null)[]>) {
    const { dayJs, fromUnix } = useDayJs()

    const disabledStartDate = (current: number) => {
        const date = unref(dateRef)
        return current > dayJs.value(date[1]).endOf('day').valueOf()
    }

    const disabledStartTime = (current: number) => {
        const date = unref(dateRef)
        const endDate = date[1]
        const ifSameDate
            = dayJs.value(current).startOf('day').valueOf()
            === dayJs.value(endDate).startOf('day').valueOf()
        return {
            isHourDisabled: (hour: number) => {
                if (!ifSameDate)
                    return false
                if (!endDate)
                    return false
                return hour > dayJs.value(endDate).hour()
            },
            isMinuteDisabled: (minute: number, hour: number | null) => {
                if (!ifSameDate || hour === null || hour < dayJs.value(endDate).hour())
                    return false
                if (!endDate)
                    return false
                return minute > dayJs.value(endDate).minute()
            },
            isSecondDisabled: (second: number, minute: number | null, hour: number | null) => {
                if (
                    !ifSameDate
                    || hour === null
                    || minute === null
                    || hour < dayJs.value(endDate).hour()
                    || (hour === dayJs.value(endDate).hour() && minute < dayJs.value(endDate).minute())
                )
                    return false
                if (!endDate)
                    return false
                return second >= dayJs.value(endDate).second()
            },
        }
    }

    const disabledEndDate = (current: number) => {
        const date = unref(dateRef)
        return current < dayJs.value(date[0]).startOf('day').valueOf()
    }

    const disabledEndTime = (current: number) => {
        const date = unref(dateRef)
        const startDate = date[0]
        const ifSameDate
            = dayJs.value(current).startOf('day').valueOf()
            === dayJs.value(startDate).startOf('day').valueOf()
        return {
            isHourDisabled: (hour: number) => {
                if (!ifSameDate)
                    return false
                if (!startDate)
                    return false
                return hour < dayJs.value(startDate).hour()
            },
            isMinuteDisabled: (minute: number, hour: number | null) => {
                if (!ifSameDate || hour === null || hour > dayJs.value(startDate).hour())
                    return false
                if (!startDate)
                    return false
                return minute < dayJs.value(startDate).minute()
            },
            isSecondDisabled: (second: number, minute: number | null, hour: number | null) => {
                if (
                    !ifSameDate
                    || hour === null
                    || minute === null
                    || hour > dayJs.value(startDate).hour()
                    || (hour === dayJs.value(startDate).hour()
                    && minute > dayJs.value(startDate).minute())
                )
                    return false
                if (!startDate)
                    return false
                return second <= dayJs.value(startDate).second()
            },
        }
    }

    return {
        disabledStartDate,
        disabledStartTime,
        disabledEndDate,
        disabledEndTime,

    }
}
