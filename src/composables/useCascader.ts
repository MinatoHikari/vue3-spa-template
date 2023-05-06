import type { CascaderOption, NCascader } from 'naive-ui';
import type { Ref } from 'vue';

export const useIndeterminateCascader = (
    cascaderRef: Ref<InstanceType<typeof NCascader> | null>,
    ids: Ref<(string | number)[] | null>,
) => {
    // const syncIds = ref<(string | number)[] | null>(null);
    const indeterminateKeys = ref<(string | number)[] | null>(null);
    const indeterminateOptions = ref<(CascaderOption | null)[]>([]);
    // if (ids) syncRef(syncIds, ids);

    watch(ids, (v) => {
        nextTick(() => {
            const result = cascaderRef.value?.getIndeterminateData();
            if (result) {
                indeterminateKeys.value = result.keys;
                indeterminateOptions.value = result.options;
            }
        });
    });

    const allSelectedKeys = computed(() => {
        return [...(ids.value ?? []), ...(indeterminateKeys.value ?? [])];
    });

    return {
        indeterminateKeys,
        indeterminateOptions,
        allSelectedKeys,
    };
};
