import { describe, expect, it } from 'vitest';
import type { EnhanceRow } from '~/composables/useNTableEnhance/useNTableEnhance';

describe('tableEnhanceUtils.insert', () => {
    const tableData = ref<EnhanceRow<{ num: number }>[]>([]);
    const { tableUtils, resolvedTableData } =
        useNTableEnhance<EnhanceRow<{ num: number }>>(tableData);

    it('should row inserted', () => {
        tableUtils.insert({
            records: [{ num: 1 }, { num: 2 }],
        });
        expect(resolvedTableData.value.length).toBe(2);
        expect(resolvedTableData.value[0].num).toBe(1);
        expect(resolvedTableData.value[1].num).toBe(2);
        tableUtils.insert({
            records: [{ num: 1 }, { num: 2 }],
        });
        expect(resolvedTableData.value[2].num).toBe(1);
        expect(resolvedTableData.value[3].num).toBe(2);
    });

    it('should insert at correct index', () => {
        tableData.value = [{ num: 1 }, { num: 2 }];
        tableUtils.insert({
            records: [{ num: 3 }, { num: 4 }],
            at: 0,
        });
        expect(resolvedTableData.value.length).toBe(4);
        expect(resolvedTableData.value[0].num).toBe(3);
        expect(resolvedTableData.value[1].num).toBe(4);
        tableUtils.insert({
            records: [{ num: 3 }, { num: 4 }, { num: 5 }],
            at: 3,
        });
        expect(resolvedTableData.value[2].num).toBe(1);
        expect(resolvedTableData.value[4].num).toBe(4);
        expect(resolvedTableData.value[6].num).toBe(2);
        tableUtils.insert({
            records: [{ num: 3 }],
            at: resolvedTableData.value.length,
        });
        expect(resolvedTableData.value.at(-1)?.num).toBe(3);
    });
});

describe('tableEnhanceUtils.remove', () => {
    const tableData = ref<EnhanceRow<{ num: number }>[]>([]);
    const { tableUtils, resolvedTableData } =
        useNTableEnhance<EnhanceRow<{ num: number }>>(tableData);

    tableUtils.insert({
        records: [
            { num: 3 },
            { num: 4 },
            { num: 5 },
            { num: 3 },
            { num: 4 },
            { num: 5 },
            { num: 3 },
            { num: 4 },
            { num: 5 },
        ],
    });

    it('should remove correct rows', () => {
        tableUtils.remove(resolvedTableData.value.filter((i) => i.num === 3));
        expect(resolvedTableData.value.length).toBe(6);
        expect(resolvedTableData.value[0].num).toBe(4);
        expect(resolvedTableData.value.at(-1)?.num).toBe(5);
        expect(resolvedTableData.value.at(-2)?.num).toBe(4);
        expect(resolvedTableData.value.at(-3)?.num).toBe(5);
    });
});
