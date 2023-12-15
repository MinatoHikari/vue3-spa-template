import type { DropdownOption } from 'naive-ui'
import { useTypedI18n } from './i18n'
import type { Locales } from './i18n'
import { useCommonStore } from '~/stores/common'

const availableLocales = ref<unknown[]>([])

export function useAvailableLocaleList() {
    return {
        availableLocales,
    }
}

export function useGlobalLanguage() {
    const commonStore = useCommonStore()
    const { t, locale } = useTypedI18n()
    const { availableLocales } = useAvailableLocaleList()

    const options = computed<DropdownOption[]>(() => [],
    // availableLocales.value.map((i) => (i)),
    )

    const nameMapRef = computed(() => {
        const map = new Map<string, string>()
        availableLocales.value.forEach((i) => {
            // map.set(i.langCode, i.langName);
        })
        return map
    })

    const handleSelect = async (key: Locales, option: DropdownOption) => {
        locale.value = key
        commonStore.locale = key
    }

    return {
        t,
        options,
        handleSelect,
        locale,
        nameMapRef,
    }
}
