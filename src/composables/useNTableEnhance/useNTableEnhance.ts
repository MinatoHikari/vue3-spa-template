import { isArray } from 'xe-utils';
import type { ComponentPublicInstance, Ref, UnwrapRef } from 'vue';
import type { DataTableBaseColumn, DataTableColumns, NInput } from 'naive-ui';

export interface insertConfig<T> {
    records: T | T[];
    at?: number;
}

export type EnhanceRow<T> = {
    innerKey?: number;
    valCache?: Map<keyof T, unknown>;
    editedMap?: Map<keyof T, boolean>;
    editValCache?: Map<keyof T, unknown>;
    originVal?: T[keyof T];
} & T;

export type EditHelper = {
    setCurrentEditingCell: (key: string | null, innerKey: number) => void;
    currentEditingCell: () => string | null;
    currentEditingRow: () => number | null;
};

export type rowEditingDataMap = Map<string, Ref<ComponentPublicInstance | null>>;

export enum EditType {
    Cell = 'cell',
    Row = 'row',
    Trigger = 'trigger',
}

const useEdit = ({ editType }: { editType: EditType }) => {
    const cellRefMap = shallowRef<Map<number, rowEditingDataMap>>(new Map());
    const triggerEditFlag = ref(false);
    const currentEditingRow = ref<number | null>(null);
    const currentEditingCell = ref<string | null>(null);
    const currentEditingCellRef = ref();

    const editHelper = {
        setCurrentEditingCell: (key, innerKey) => {
            currentEditingCell.value = key;
            nextTick(() => {
                const itemRefMap = cellRefMap.value.get(innerKey);
                const item = itemRefMap?.get(key as string);
                if (item) (item?.value as InstanceType<typeof NInput>).focus();
            });
        },
        currentEditingCell: () => currentEditingCell.value,
        currentEditingRow: () => currentEditingRow.value,
    } satisfies EditHelper;

    const getHelpers = <Row>(row: EnhanceRow<Row>, key: keyof Row) => {
        const itemRef = ref<ComponentPublicInstance | null>(null);
        const innerKey = row.innerKey as number;

        const isEditing = computed({
            get: () => {
                if (editType === EditType.Cell)
                    return (
                        currentEditingCell.value === key && currentEditingRow.value === row.innerKey
                    );
                else if (editType === EditType.Trigger) {
                    return triggerEditFlag.value && currentEditingRow.value === row.innerKey;
                }
                return currentEditingRow.value === row.innerKey;
            },
            set: (v) => {
                if (!v) currentEditingCell.value = null;
            },
        });

        if (innerKey || innerKey === 0) {
            if (!cellRefMap.value.has(innerKey)) {
                cellRefMap.value.set(innerKey, new Map());
            }
            const itemRefMap = cellRefMap.value.get(innerKey);
            if (itemRefMap && !itemRefMap.has(key as string)) {
                itemRefMap.set(key as string, itemRef);
            }
        }

        const computedItemRef = computed({
            get: () => {
                const itemRefMap = cellRefMap.value.get(innerKey);
                return itemRefMap?.get(key as string)?.value ?? null;
            },
            set: (v) => {
                const itemRefMap = cellRefMap.value.get(innerKey) as rowEditingDataMap;
                const itemRef = itemRefMap.get(
                    key as string,
                ) as Ref<ComponentPublicInstance | null>;
                itemRef.value = v;
            },
        });

        const onEditingUpdate = (v: boolean) => (isEditing.value = v);
        const onRefUpdate = (v: ComponentPublicInstance) => {
            computedItemRef.value = v;
        };

        return {
            isEditing,
            itemRef: computedItemRef,
            currentEditingCellRef,
            onEditingUpdate,
            onRefUpdate,
        };
    };

    const triggerClick = (e: MouseEvent) => {
        triggerEditFlag.value = !triggerEditFlag.value;
    };

    return {
        currentEditingCell,
        currentEditingCellRef,
        currentEditingRow,
        editHelper,
        getHelpers,
        triggerClick,
    };
};

export const useNTableEnhance = <Row = {}>(
    originTableData: Ref<UnwrapRef<(EnhanceRow<Row> | Row)[]>>,
    enhanceConfig: {
        cache?: boolean;
        editType?: EditType;
    } = {},
) => {
    const { cache, editType } = enhanceConfig;
    const { currentEditingCellRef, currentEditingRow, editHelper, getHelpers, triggerClick } =
        useEdit({
            editType: editType ?? EditType.Cell,
        });

    const registerColumns = (columns: Ref<DataTableColumns<EnhanceRow<Row>>>) => {
        columns.value.forEach((i) => {
            i.cellProps = (rowData, rowIndex) => {
                const key = (i as DataTableBaseColumn).key as keyof Row;
                let edited: boolean | undefined = false;
                if (cache && rowData?.valCache?.has(key)) {
                    edited = rowData.editedMap?.get(key);
                }
                const res: { edited: boolean; isNew: boolean } = {
                    edited: edited ?? false,
                    isNew: false,
                };
                return {
                    class: `${res.edited ? 'edited ' : ''}`,
                    onClick: () => {
                        currentEditingRow.value = rowData.innerKey ?? null;
                        // if (
                        //     currentEditingCell.value &&
                        //     (i as DataTableBaseColumn).key !== currentEditingCell.value
                        // )
                        //     return;
                        editHelper.setCurrentEditingCell(key as string, rowData.innerKey as number);
                    },
                };
            };
        });
    };

    let indexId = 0;

    const resolvedTableData = computed(() => [...(originTableData.value ?? [])]);

    const initRows = (rows: UnwrapRef<EnhanceRow<Row>[]>) => {
        rows.forEach((i) => {
            if (!i.innerKey) {
                i.innerKey = indexId;
                indexId = indexId + 1;
            }
            if (cache && !i.valCache) {
                i.valCache = new Map();
            }
            if (cache && !i.editValCache) i.editValCache = new Map();
            if (cache && !i.editedMap) i.editedMap = new Map();
        });
    };

    const tableUtils = {
        insert: (insertCnf: insertConfig<Row>) => {
            const insertedRows = (
                isArray(insertCnf.records) ? insertCnf.records : [insertCnf.records]
            ) as UnwrapRef<EnhanceRow<Row>[]>;
            initRows(insertedRows);
            if (!insertCnf.at && insertCnf.at !== 0) insertCnf.at = -1;
            if (insertCnf.at > originTableData.value.length) insertCnf.at = -1;
            if (insertCnf.at === -1) {
                originTableData.value.push(...insertedRows);
            } else if (insertCnf.at === 0) {
                originTableData.value.unshift(...insertedRows);
            } else {
                const index = insertCnf.at;
                originTableData.value.splice(index, 0, ...insertedRows);
            }
        },
        remove: (rows: EnhanceRow<Row>[]) => {
            const map = new Map<number, EnhanceRow<Row>>();
            rows.forEach((i) => map.set(i.innerKey as number, i));
            originTableData.value = originTableData.value.filter((i) => {
                return !map.has((i as EnhanceRow<Row>).innerKey as number);
            });
        },
        clearTable: () => {
            originTableData.value = [];
        },
    };

    watch(
        () => [...originTableData.value],
        (newV, oldV) => {
            initRows(newV as UnwrapRef<EnhanceRow<Row>[]>);
        },
        {
            immediate: true,
        },
    );

    return {
        resolvedTableData,
        tableUtils,
        editHelper,
        registerColumns,
        getHelpers,
        currentEditingCellRef,
        triggerClick,
    };
};
