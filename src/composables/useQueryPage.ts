import type { UsePaginationParams } from './usePagination'
import type { TableCommonParams } from './useTableCommon'

export type UseQueryPageParams = {
    paginationParams?: UsePaginationParams
    resetForm?: () => void
    fetchData?: () => void
} & TableCommonParams

export function useQueryPage(params: UseQueryPageParams = { flexHeightDifferences: 38 }) {
    const {
        paginationParams,
        resetForm,
        fetchData,
        flexHeightTable,
        flexHeightDifferences,
        remote,
    } = params
    const {
        handlePageChange,
        handlrPageSizeChange,
        pageSize,
        current,
        total,
        registEvent,
        pageSizes,
        suffix,
    } = usePagination(paginationParams)

    registEvent(() => {
        fetchData && fetchData()
    })

    const collapsed = ref(false)

    const search = async () => {
        current.value = 1
        handlePageChange(1)
    }

    const resetPage = async () => {
        current.value = 1
        resetForm && resetForm()
        handlePageChange(1)
    }

    const paginationProps = computed({
        get: () => ({
            page: current.value,
            pageSize: pageSize.value,
            showQuickJumper: true,
            showSizePicker: true,
            itemCount: total.value,
            pageSizes: pageSizes.value,
            suffix,
        }),
        set: (val) => {
            console.log(val)
            pageSize.value = val.pageSize
            current.value = val.page
            total.value = val.itemCount
        },
    })

    const { tableCommonProps } = useTableCommon({
        remote,
        flexHeightTable,
        flexHeightDifferences,
    })

    const tableEvents = {
        'on-update:page': handlePageChange,
        'on-update:page-size': handlrPageSizeChange,
    }

    return {
        search,
        resetPage,
        collapsed,
        current,
        pageSize,
        total,
        registEvent,
        handlePageChange,
        handlrPageSizeChange,
        pageSizes,
        suffix,
        paginationProps,
        tableEvents,
        tableCommonProps,
    }
}
