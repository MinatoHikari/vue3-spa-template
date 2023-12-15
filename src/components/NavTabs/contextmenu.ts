import type { Ref } from 'vue'
import type { NavDataOrigin } from '~/utils/router'

export function useContextMenu({
    navTabList,
    currentKey,
}: {
    navTabList: Ref<NavDataOrigin[]>
    currentKey: Ref<string>
}) {
    const router = useRouter()
    const { t } = useTypedI18n()

    const showDropdown = ref(false)
    const x = ref(0)
    const y = ref(0)
    const clickTabIndex = ref(0)

    enum DropDownKey {
        DeleteOther = 'deleteOther',
        DeleteRight = 'deleteRight',
        DeleteLeft = 'deleteLeft',
    }

    const options = computed(() => [
        {
            label: t('dropdown.close_others'),
            key: DropDownKey.DeleteOther,
        },
        {
            label: t('dropdown.close_right'),
            key: DropDownKey.DeleteRight,
        },
        {
            label: t('dropdown.close_left'),
            key: DropDownKey.DeleteLeft,
        },
    ])

    const handleTabClick = (index: number, e: MouseEvent) => {
        showDropdown.value = true
        x.value = e.clientX
        y.value = e.clientY
        clickTabIndex.value = index
    }
    const clickOutSide = () => {
        showDropdown.value = false
    }
    const handleDropdownSelect = (key: DropDownKey) => {
        switch (key) {
            case DropDownKey.DeleteOther: {
                navTabList.value = [navTabList.value[clickTabIndex.value]]
                router.push(navTabList.value.at(-1)?.path as string)
                break
            }
            case DropDownKey.DeleteRight: {
                const deletedTabs = navTabList.value.splice(clickTabIndex.value + 1)
                if (deletedTabs.length > 0) {
                    if (deletedTabs.some(i => i.path === currentKey.value))
                        router.push(navTabList.value.at(-1)?.path as string)
                }
                break
            }
            case DropDownKey.DeleteLeft: {
                const deletedTabs = navTabList.value.splice(0, clickTabIndex.value)
                if (deletedTabs.length > 0) {
                    if (deletedTabs.some(i => i.path === currentKey.value))
                        router.push(navTabList.value.at(-1)?.path as string)
                }
                break
            }
        }
        showDropdown.value = false
    }

    return {
        showDropdown,
        x,
        y,
        options,
        handleTabClick,
        clickOutSide,
        handleDropdownSelect,
    }
}
