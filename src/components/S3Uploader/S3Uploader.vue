<script setup lang="ts">
import type { UploadCustomRequestOptions } from 'naive-ui'
import { NUpload, uploadProps, useMessage } from 'naive-ui'
import type { PropType } from 'vue'
import type { S3Response } from './type'
import { DirMap } from '~/composables/useAwsS3'
import type { S3ConfigProps } from '~/composables/useAwsS3'
import Download from '~icons/carbon/download'
import Upload from '~icons/carbon/upload'
import { baseUrl } from '~/utils/http/request'
import { getFileSize } from '~/utils/toolFunction'

const props = defineProps({
    ...uploadProps,
    showFileName: {
        type: Boolean,
        default: true,
    },
    downloadKey: {
        type: String,
        default: '',
    },
    downloadRename: {
        type: String,
        default: '',
    },
    dir: {
        type: String as PropType<DirMap>,
        default: DirMap.Other,
    },
    showFileList: {
        type: Boolean,
        default: false,
    },
    showPreviewButton: {
        type: Boolean,
        default: false,
    },
    showDownloadButton: {
        type: Boolean,
        default: false,
    },
    ellipsisMaxWidth: Number,
    onBeforeS3Upload: {
        type: Function as PropType<(file: File) => { file: File, fileName: string }>,
    },
    hideUploadButton: {
        type: Boolean,
        default: false,
    },
    uploadRequirements: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits({
    afterUpload: (res?: S3Response) => {
        return res
    },
})

const keys = Object.keys(uploadProps)
const message = useMessage()

const pickUploaderProps = reactiveOmit(
    reactivePick(props, keys as (keyof typeof uploadProps)[]),
    'customRequest',
)

const uploaderRef = ref()
const { postRequest } = useApis()

const { putObject, downloadObject } = useAwsS3()

/**
 * 上传文件之后，保存选择的文件名
 */
function saveS3FileName(sourceName: string, fileInfo: { url: string }) {
    return new Promise((resolve) => {
        const sourceFileName = sourceName.substring(0, sourceName.lastIndexOf('.'))
        postRequest<{ sourceName: string, fileInfo: { url: string } }, S3ConfigProps>(
            `${baseUrl}/auth/aws/`,
            { sourceName: sourceFileName, fileInfo },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        ).then(({ res }) => {
            // console.log('res', res);
            resolve(true)
        })
    })
}

function getKeyFileName() {
    if (!props.downloadKey)
        return ''
    const splitKey = props.downloadKey.split('/')
    // rename = splitKey[splitKey.length - 1]
    // console.log('splitKey[splitKey.length - 1]', splitKey[splitKey.length - 1]);
    // return splitKey[splitKey.length - 1].split('.')[1] // 这是没后缀的
    return splitKey[splitKey.length - 1].split('.').slice(1).join('.')
}

function downloadObjectPrivate() {
    let rename = ''
    if (!props.downloadRename) {
        const splitKey = props.downloadKey.split('/')
        rename = splitKey[splitKey.length - 1].split('.')[1]
    }
    else {
        rename = props.downloadRename
    }
    downloadObject(props.downloadKey, rename)
}

// 自定义文件上传
async function uploadRequest(e: UploadCustomRequestOptions) {
    if (props.uploadRequirements) {
        if (e.file.name.search(/[\s\S](\.jpg|\.png|\.bmp|\.gif)/i) === -1) {
            message.error('只能上传jpg、png、bmp、gif、格式的图片文件，请重新上传')
            return
        }
        if (getFileSize(e.file.file?.size, 'MB') > 1) {
            setTimeout(() => {
                message.warning(`${e.file.name}超出1MB`)
            }, 0)
            return
        }
    }
    if (!e.file.file)
        return

    let file = e.file.file
    let fileName = e.file.name
    if (props.onBeforeS3Upload) {
        const res = props.onBeforeS3Upload(file)
        file = res.file
        fileName = res.fileName
    }
    const res = await putObject(file, fileName, props.dir)
    // const listRes = await listObjects({});
    emit('afterUpload', res)
    uploaderRef.value.clear()
}
</script>

<template>
    <NSpace class="uploader-container" align="center" :wrap="false">
        <NUpload
            ref="uploaderRef"
            flex
            flex-wrap
            v-bind="pickUploaderProps"
            :custom-request="uploadRequest"
        >
            <slot name="button">
                <div v-if="!hideUploadButton" class="load">
                    <NIcon flex cursor-pointer>
                        <Upload />
                    </NIcon>
                </div>
            </slot>
        </NUpload>
        <div
            v-if="props.showFileName"
            class="file-name"
            :style="{ maxWidth: ellipsisMaxWidth ? `${ellipsisMaxWidth}px` : '80px' }"
        >
            <NEllipsis>
                {{ getKeyFileName() }}
            </NEllipsis>
        </div>
        <div v-if="props.showDownloadButton" class="load" @click="downloadObjectPrivate">
            <NIcon flex cursor-pointer>
                <Download />
            </NIcon>
        </div>
    <!-- 删除 -->
    <!-- <div v-if="props.showDownloadButton" class="load" @click="deleteObject(props.downloadKey)">
            Delete
        </div> -->
    </NSpace>
</template>
