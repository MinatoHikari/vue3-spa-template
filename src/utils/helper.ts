import type { ComponentPublicInstance, Ref } from 'vue';

export type InstanceOrNull<T extends abstract new (...args: any) => any> = InstanceType<T> | null;

export type Nullable<T> = { [P in keyof T]: T[P] | null };
export type PartialNullable<T> = { [P in keyof T]?: T[P] | null };

export interface CommonData {
    [key: string]: string | number | null;
}

export interface FunctionRefWrapperConfig {
    changeOnlyWhenVmExist?: boolean;
    callback?: (vm: ComponentPublicInstance | Element | null) => void;
}

export const functionRefWrapper = <T extends ComponentPublicInstance | null>(
    ref: Ref<T>,
    config: FunctionRefWrapperConfig = {
        changeOnlyWhenVmExist: false,
    },
) => {
    return (vm: ComponentPublicInstance | Element | null) => {
        const { changeOnlyWhenVmExist, callback } = config;
        if (!changeOnlyWhenVmExist || vm) ref.value = vm as T;
        callback && callback(vm);
    };
};

export function rowIdWrapper<Row, Key extends keyof NonNullable<Row>>(
    key: Key,
): (row: NonNullable<Row>) => NonNullable<Row>[Key];
export function rowIdWrapper<Row, Key extends keyof NonNullable<Row>>(
    source: Row | Row[] | Ref<Row> | Ref<Row[]>,
    key: Key,
): (row: NonNullable<Row>) => NonNullable<Row>[Key];
export function rowIdWrapper<Row, Key extends keyof NonNullable<Row>>(
    sourceOrKey: Row | Row[] | Ref<Row> | Ref<Row[]> | Key,
    key?: Key,
) {
    const resolvedKey = key ?? (sourceOrKey as Key);
    return (row: NonNullable<Row>) => row[resolvedKey];
}
