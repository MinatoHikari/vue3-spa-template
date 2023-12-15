export type SpecsBoolean = 'yes' | 'no' | '1' | '0'
export type NumberOrNumberTemplate = `${number}` | number
export interface Specs {
    channelmode?: SpecsBoolean
    directories?: SpecsBoolean
    fullscreen?: SpecsBoolean
    height?: NumberOrNumberTemplate
    left?: NumberOrNumberTemplate
    location?: SpecsBoolean
    menubar?: SpecsBoolean
    resizable?: SpecsBoolean
    scrollbars?: SpecsBoolean
    status?: SpecsBoolean
    titlebar?: SpecsBoolean
    toolbar?: SpecsBoolean
    top?: NumberOrNumberTemplate
    width?: NumberOrNumberTemplate
}
export interface newWindowParams {
    [key: string]: string | undefined
    is?: string
    showMenu?: string
}
export interface OpenNewWindowConfig {
    /** window.open 选项，具体看mdn */
    specs?: Specs
    /** 打开的新标签页是否显示导航栏 */
    showMenu?: boolean
    /** pageContainer 子页面名称, 打开新标签页时可以根据这个参数判断是否进入子页面/是否是新标签页打开 */
    is?: string
    /** 要传递的参数，会跟在 url 后面 */
    params?: URLSearchParams | string | Record<string, string> | string[][]
}

export function useNewWindow() {
    const openNewWindow = (pathName: string, config?: OpenNewWindowConfig) => {
        const target = pathName.split('?')[0]
        const paramsStr = pathName.split('?')[1] ?? ''
        const configParamsStr = config ? new URLSearchParams(config.params).toString() ?? '' : ''
        const paramsObj: newWindowParams = {}
        if (config) {
            paramsObj.showMenu = config.showMenu ? '1' : '0'
            if (config.is)
                paramsObj.is = config.is
        }
        const params = new URLSearchParams(paramsObj as Record<string, string>)
        const url = new URL(`${window.location.origin}${target}`)
        const ifParamStr = paramsStr ? `&${paramsStr}` : ''
        const ifConfigParamsStr = configParamsStr ? `&${configParamsStr}` : ''
        url.search = `${params.toString()}${ifParamStr}${ifConfigParamsStr}`
        if (config && config.specs) {
            const specsArr: string[] = []
            for (const key in config.specs)
                specsArr.push(`${key}=${config.specs[key as keyof Specs]}`)

            window.open(url, '', specsArr.join(','))
        }
        else {
            window.open(url)
        }
    }

    return {
    /** 打开新标签页，设置 is 参数可以跳转到对应的 pageContainer 子页面, 传递参数用 params, showMenu 可以让新标签页隐藏导航栏 */
        openNewWindow,
    }
}
