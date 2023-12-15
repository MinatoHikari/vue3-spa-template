import type { MaybeRefOrGetter } from '@vueuse/core'
import type { FormItemGiProps } from 'naive-ui'
import type { GetObjectOutput } from '@aws-sdk/client-s3'
import * as binconv from 'binconv'
import type { AxiosHeaders, RawAxiosRequestHeaders } from 'axios'
import { globalMessage } from './discreteApi'
import { i18nGlobal } from '~/utils/i18n'

export function getFileSize(
    file?: File | null | number,
    unit: 'MB' | 'GB' | 'KB' = 'MB',
    fixed?: number,
) {
    if (!file) return 0
    let res = 0
    const size = typeof file === 'number' ? file : file.size
    if (unit === 'KB') res = ((size / 1024) * 100) / 100
    if (unit === 'GB') res = ((size / 1024 / 1024 / 1024) * 100) / 100
    if (unit === 'MB') res = ((size / 1024 / 1024) * 100) / 100
    if (fixed) {
        const pow = 10 ** fixed
        res = Math.round(res * pow) / pow
    }
    return res
}

// 根据文件名 是图片返回 true
export function canFileBePreviewedByName(fileName: string) {
    const regex = /[\s\S](\.gif|\.jpeg|\.png|\.jpg|\.bmp|\.webp)/i
    return !(fileName.search(regex) === -1)
}

export function paramsFilter(params: { [key: string]: any }): Record<string, any> {
    const reqParam: { [key: string]: any } = {}
    for (const key in params) {
        if (params[key] || params[key] === 0) reqParam[key] = params[key]
    }
    return reqParam
}

export function createDownload(blobOrUrl: Blob | string, filename?: string) {
    const elink = document.createElement('a')

    if ('download' in elink) {
        elink.download = filename || 'file'

        elink.style.display = 'none'

        elink.href = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl)

        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
    }
}

export function getFileNameFormHeader(headers: AxiosHeaders) {
    const header = (headers as RawAxiosRequestHeaders)['content-disposition'] as string
    console.log(decodeURIComponent((header || '').split('filename=')[1]))
    return decodeURIComponent((header || '').split('filename=')[1]).replaceAll('"', '')
}

export function downloadCallback(response: Blob | any, filename?: string) {
    console.log(response)
    const isBlob = response instanceof Blob
    let blob: Blob
    console.log(isBlob, response)
    if (isBlob) {
        blob = response as Blob
        console.log(blob.size)
        if (blob.size === 0) return globalMessage.warning(i18nGlobal.t('export.noDataToExport'))
    }
    else {
        const res = response as Blob
        if (!res) return globalMessage.warning(i18nGlobal.t('export.noDataToExport'))
        blob = res
        console.log(res)
        if (res.size === 0) return globalMessage.warning(i18nGlobal.t('export.noDataToExport'))
    }

    createDownload(blob, filename)
}

export function getRecordIndex(
    params: MaybeRefOrGetter<{ index: number, size: number, page: number }>,
) {
    const { index, size, page } = resolveUnref(params)
    return (page - 1) * size + index + 1
}

export interface FilterNullConifg {
    filterEmptyString?: boolean
    deepClone?: boolean
}
export type UnknownAnyKeyRecord = Record<string | number | symbol, unknown>
export type UnknownCommonKeyRecord = Record<string | number, unknown>

export function filterNull<T extends UnknownAnyKeyRecord>(
    records: T,
    config: FilterNullConifg = {
        filterEmptyString: false,
        deepClone: false,
    },
) {
    let copy: object & T
    if (Array.isArray(records)) copy = Object.assign([], records)
    else copy = Object.assign({}, records)
    const { filterEmptyString, deepClone } = config
    let newObj: object & T = copy

    if (deepClone) newObj = structuredClone ? structuredClone(copy) : clone(copy, true)
    const keys = Reflect.ownKeys(newObj)
    for (const key of keys) {
        const val = Reflect.get(records, key)
        if (!val && val !== 0) {
            if (typeof val !== 'string') {
                Reflect.deleteProperty(records, key)
                continue
            }
            else if (filterEmptyString && val === '') {
                Reflect.deleteProperty(records, key)
            }
            else if (!filterEmptyString && val === '') {
                continue
            }
        }
    }

    return newObj as { [P in keyof T]: NonNullable<T[P]> }
}

export interface SetLabelWidthByColumnRule {
    labelWidth: number
}

export function setLabelWidthByColumn(
    list: { formItemGiProps: FormItemGiProps }[],
    rule: SetLabelWidthByColumnRule[],
) {
    let column = 1
    for (let i = 0; i <= list.length; i++) {
        const item = list[i]
        if (!item.formItemGiProps) item.formItemGiProps = {}
        item.formItemGiProps.labelWidth = rule[column - 1].labelWidth
        column += 1
        if (column > rule.length) column = 1
    }
}

export interface ls {
    labelWidth: number
    status: boolean
}

export async function blobToImage(data: GetObjectOutput) {
    const blob = await binconv.readableStreamToBlob(data.Body as ReadableStream)
    const newBlob = new Blob([blob], { type: data.ContentType })
    console.log(newBlob)
    const url = URL.createObjectURL(newBlob)
    return url
}

export const chinese = /^[\u4E00-\u9FA5]$/

export function getByteLength(str: string) {
    if (str.length === 0) return 0

    const charList = str.split('')
    let l = 0
    charList.forEach((el) => {
        chinese.test(el) ? (l += 3) : (l += 1)
    })
    return l
}
