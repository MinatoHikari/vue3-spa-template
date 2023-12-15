import type { PaginationInfo } from 'naive-ui'

export interface UsePaginationParams {
    defaultPageSize?: number
}

export function usePagination(params: UsePaginationParams = {}) {
    const { t } = useTypedI18n()
    const eventHook = createEventHook<number>()
    const { defaultPageSize } = params
    const current = ref(1)
    const pageSize = ref(defaultPageSize ?? 30)
    const total = ref(0)

    const handlePageChange = async (page: number) => {
        current.value = page
        eventHook.trigger(page)
    }

    const handlrPageSizeChange = async (size: number) => {
        pageSize.value = size
        current.value = 1
        handlePageChange(1)
    }

    const pageSizes = computed(() => [
        {
            label: t('pagination.pages', { number: 10 }),
            value: 10,
        },
        {
            label: t('pagination.pages', { number: 20 }),

            value: 20,
        },
        {
            label: t('pagination.pages', { number: 30 }),

            value: 30,
        },
        {
            label: t('pagination.pages', { number: 50 }),

            value: 50,
        },
        {
            label: t('pagination.pages', { number: 100 }),

            value: 100,
        },
    ])

    const suffix = (info: PaginationInfo) => {
        return t('pagination.total', { number: info.itemCount })
    }

    return {
        current,
        pageSize,
        total,
        handlePageChange,
        registEvent: eventHook.on,
        handlrPageSizeChange,
        pageSizes,
        suffix,
    }
}
