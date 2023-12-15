<script setup lang="ts">
import { NAutoComplete } from 'naive-ui'
import decamelize from 'decamelize'
import camelcase from 'camelcase'
import { useRouteSearchDialog } from './routeSearchDialog'
import { MenuType, normalizePath, routeMap } from '~/utils/router'

const router = useRouter()
const value = ref<string | undefined>(undefined)
watch(value, (v) => {
    if (v && v.match(/[a-zA-Z]+/) && !v.includes('/'))
        value.value = `${decamelize(v, { separator: '/' })}`
})
const input = templateRef<typeof NAutoComplete>('input')
const { handleAfterEnter, dialogVisible } = useRouteSearchDialog()
handleAfterEnter.on(() => {
    value.value = undefined
    input.value.focus()
})
function matchRule(val: string, path: string, title?: string) {
    if (path.toUpperCase().includes(val.toUpperCase()))
        return true
    if (camelcase(path.replaceAll('/', '-')).includes(camelcase(val.replaceAll('/', '-'))))
        return true
    if (!val.match(/[a-zA-Z\/]+/) && title?.includes(val))
        return true
    if (val.includes('/')) {
        const valArr = normalizePath(val)
            .split('/')
            .filter(i => i)
        const pathArr = path.split('/').filter(i => i)

        if (
            valArr.every(
                (str, index) =>
                    pathArr[index] && pathArr[index].toUpperCase().includes(str.toUpperCase()),
            )
        )
            return true
    }
    return false
}
const options = computed(() => {
    const val = value.value
    return Array.from(routeMap.entries())
        .filter((i) => {
            return (
                val && i[1].menuType === MenuType.Menu && matchRule(val, i[0], i[1]?.meta?.title)
            )
        })
        .map((i) => {
            return {
                label: `${i[1].meta?.title} -- ${i[0]}`,
                value: i[0],
            }
        })
})
function onSelect(path: string) {
    router.push(path)
    dialogVisible.value = false
}
</script>

<template>
    <div>
        <NAutoComplete
            ref="input"
            v-model:value="value"
            :options="options"
            @select="(path) => onSelect(path as string)"
        />
    </div>
</template>
