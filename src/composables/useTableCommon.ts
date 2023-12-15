import type { MaybeRefOrGetter } from '@vueuse/core'
import type { DataTableColumn, DataTableProps } from 'naive-ui'

export interface TableCommonParams {
    remote?: MaybeRefOrGetter<boolean>
    flexHeightTable?: MaybeRefOrGetter<boolean>
    /** fill-remain 内部的表格距离底部的距离, 默认表格上面有toolbar为38, 如没有 toolbar 设置为0, 如有其他内容自行根据内容高度设置 */
    flexHeightDifferences?: MaybeRefOrGetter<number>
}

export function useTableCommon(config?: TableCommonParams) {
    const { flexHeightDifferences, flexHeightTable, remote } = config ?? {}

    const tableCommonProps = markRaw({
        remote: resolveUnref(remote ?? true),
        size: 'small',
        bordered: false,
        striped: true,
    } as DataTableProps & { style?: Partial<CSSStyleDeclaration> })

    if (resolveUnref(flexHeightTable ?? false)) {
        tableCommonProps.flexHeight = true
        tableCommonProps.style = `height: calc(100% - ${
            resolveUnref(flexHeightDifferences) ?? 38
        }px)`
        // tableCommonProps.style = `flex:auto;max-height: calc(100% - ${
        //     resolveUnref(flexHeightDifferences) ?? 38
        // }px)`;
        // if (flexHeightDifferences) {
        //     tableCommonProps.style = `${tableCommonProps.style}max-height: calc(100% - ${
        //         resolveUnref(flexHeightDifferences) ?? 38
        //     }px)`;
        // }
    }

    return {
        tableCommonProps,
    }
}

export function generateTableColumns<T>(columns: DataTableColumn<T>[], config: MaybeRefOrGetter<{ ellipsis?: DataTableColumn['ellipsis'], resizable?: boolean }> = {
    ellipsis: { tooltip: true },
    resizable: false,
}) {
    const { ellipsis, resizable } = resolveUnref(config)
    return columns.map((i) => {
        return {
            ellipsis: ellipsis ?? { tooltip: true },
            resizable: resizable ?? false,
            ...i,
        }
    })
}

export function useTableSelections<Row = Record<string, unknown>>() {
    const checkedRowKeys = ref<Array<string | number>>([])
    const checkedRows = ref<Row[]>([])

    const handleRowKeysUpdate = (keys: Array<string | number>, rows: Record<string, unknown>[]) => {
        checkedRowKeys.value = [...keys]
        checkedRows.value = [...rows] as typeof checkedRows.value
    }

    return {
        checkedRowKeys,
        checkedRows,
        handleRowKeysUpdate,
        rowKeyProps: reactive({
            'checked-row-keys': checkedRowKeys,
            'on-update:checked-row-keys': handleRowKeysUpdate,
        }),
    }
}
