import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'

export enum RouteType {
    InnerLink = 'InnerLink',
}

export enum MenuType {
    Directory = 'D',
    Menu = 'M',
    Button = 'B',
}
export interface NavDataOrigin {
    key?: number | string | symbol
    children?: NavDataOrigin[]
    label?: string | JSX.Element
    path?: string
    parent?: { label?: string | JSX.Element, children?: NavDataOrigin[] } | NavDataOrigin
    name?: string
    hidden?: boolean
    menuType?: MenuType
    redirect?: string
    query?: string
    alwaysShow?: boolean
    component?: string | RouteType
    meta?: RouteMeta
    rootKey?: string
    isFrame?: '1' | '0'
}

export interface RouteMeta {
    title: string
    icon: string
    noCache: boolean
    link: string
}

export const routes = setupLayouts(generatedRoutes)

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export const routeMap = new Map<string, NavDataOrigin>()

export function normalizePath(path: string) {
    if (path[0] !== '/')
        return `/${path}`
    return path
}

export function deNormalizePath(path: string) {
    const arr = path.split('/')
    if (path[0] === '/')
        arr.shift()
    return arr.join('/')
}

export function formatRoutes<T = Record<string, unknown>>(source: T[], parentName?: string, rootKey?: string) {
    for (let i = 0; i < source.length; i++) {
        const item = (source as NavDataOrigin[])[i]
        // if (item.hidden) console.log(item);
        if (rootKey)
            item.rootKey = rootKey
        if (item.path && item.component !== RouteType.InnerLink) {
            item.path = normalizePath(item.path).trim()
            routeMap.set(item.path, item)
        }
        item.key = item.name ?? (item.path as string)
        if (item.children)
            item.children = formatRoutes(item.children, item.path, rootKey ?? item.key)
    }
    return source.filter(i => !(i as NavDataOrigin).hidden)
}
