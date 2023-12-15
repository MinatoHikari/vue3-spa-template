// import type { GetObjectOutput } from '@aws-sdk/client-s3';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'

// import * as binconv from 'binconv';
import { uuid } from 'vue3-uuid'
import { Upload } from '@aws-sdk/lib-storage'
import { XhrHttpHandler } from '@aws-sdk/xhr-http-handler'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { S3Response } from '~/components/S3Uploader/type'
import { baseUrl } from '~/utils/http/request'
import { createDownload } from '~/utils/toolFunction'

export interface S3ConfigProps {
    accessKeyId: string
    expiration: string
    secretAccessKey: string
    sessionToken: string
}

export enum DirMap {
    Order = '/order',
    Other = '/other',
}

export function useAwsS3() {
    const { t } = useTypedI18n()
    const { postRequest } = useApis()

    const S3Config = ref<S3ConfigProps>()
    const S3Ref = ref<InstanceType<typeof S3>>()
    const S3XhrRef = ref<InstanceType<typeof S3>>()
    const xhrHandler = new XhrHttpHandler()

    const onDownloadProgress = () => {
        xhrHandler.on(XhrHttpHandler.EVENTS.PROGRESS, (progress, request) => {
            console.log(progress)
        })
    }

    // 如果需要用原始文件名的对应自己改用这个方法
    const getFileNameOld = function (fileName: string): string {
        return fileName
    }

    // 上传文件名默认是用这个名称随机改变的
    const getFileName = function (fileName: string) {
        const id = uuid.v4().replace(/\-/g, '')
        return {
            id,
            fullName: `${id}.${fileName}`,
        }
    }

    const getS3Config = () => {
        return new Promise((resolve) => {
            postRequest<{}, S3ConfigProps>(
                `${baseUrl}/auth/aws`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ).then(({ res }) => {
                if (res && res.accessKeyId) {
                    S3Config.value = res
                    const param = {
                        credentials: {
                            sessionToken: res.sessionToken,
                            accessKeyId: res.accessKeyId,
                            secretAccessKey: res.secretAccessKey,
                            // expiration: dayJs.value(res.expiration).toDate(),
                        },
                        region: import.meta.env.VITE_S3_REGION,
                    }
                    S3Ref.value = new S3(param)
                    S3XhrRef.value = new S3({
                        ...param,
                        requestHandler: xhrHandler,
                    })
                    resolve(true)
                }
            })
        })
    }

    const ensureS3Ref = async () => {
        if (S3Ref.value && S3XhrRef.value) {
            return true
        }
        else {
            await getS3Config()
            if (S3Ref.value && S3XhrRef.value)
                return true
            else
                return false
        }
    }

    // 文件上传
    const putObject = async (
        file: File,
        filename: string,
        dir: DirMap,
        config: { onProgress?: (percentage: number) => void } = {},
    ) => {
        const { onProgress } = config
        const configGot = await ensureS3Ref()
        if (!configGot)
            return

        const _return: S3Response = {
            status: 0,
            msg: '',
            data: {
                name: '',
                key: '',
            },
        }

        const { id, fullName } = getFileName(filename)
        const key = `${import.meta.env.VITE_S3_DIR}${dir}/${fullName}`
        console.log(file)

        S3Ref.value
            ?.putObject(
                {
                    Bucket: import.meta.env.VITE_S3_BUCKET,
                    Key: key,
                    Body: file,
                    // ACL: 'public-read',
                },
                {},
            )
            .then((res) => {})

        if (S3XhrRef.value) {
            try {
                const parallelUploads3 = new Upload({
                    client: S3XhrRef.value,
                    params: {
                        Bucket: import.meta.env.VITE_S3_BUCKET,
                        Key: key,
                        Body: file,
                        // ACL: 'public-read',
                    },
                    // queueSize: 4, // optional concurrency configuration
                    // partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    // leavePartsOnError: false, // optional manually handle dropped parts
                })

                if (onProgress) {
                    parallelUploads3.on('httpUploadProgress', (progress) => {
                        let percentage = 0
                        if (progress.loaded && progress.total)
                            percentage = (progress.loaded / progress.total) * 100
                        onProgress(percentage)
                    })
                }

                const output = await parallelUploads3.done()

                if (output && output.$metadata && output.$metadata.httpStatusCode === 200) {
                    _return.status = 1
                    _return.data = {
                        name: filename,
                        key,
                        id,
                    }
                }
                else {
                    _return.msg = output.toString()
                }
                // console.log('output', output)
                return _return
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    // 文件删除
    const deleteObject = async (key: string) => {
        const configGot = await ensureS3Ref()
        if (!configGot)
            return

        const _return: S3Response = {
            status: 0,
            msg: '',
            data: null,
        }

        const output = await S3Ref.value!.deleteObject({
            Bucket: import.meta.env.VITE_S3_BUCKET,
            Key: key,
        })

        if (output.$metadata && output.$metadata.httpStatusCode === 200)
            _return.status = 1

        _return.data = output

        return _return
    }

    // 文件列表
    const listObjects = async (filter: {
        Delimiter?: string
        Marker?: string
        MaxKeys?: number
        Prefix?: string
        ExpectedBucketOwner?: string
    }) => {
        const configGot = await ensureS3Ref()
        if (!configGot)
            return

        const _return: S3Response = {
            status: 0,
            msg: '',
            data: null,
        }

        const output = await S3Ref.value!.listObjects({
            ...filter,
            Bucket: import.meta.env.VITE_S3_BUCKET,
            EncodingType: 'url',
            RequestPayer: 'requester',
        })

        if (output.Contents)
            _return.status = 1

        _return.data = output

        return _return
    }

    // 获取文件内容
    const getObject = async (key: string) => {
        const configGot = await ensureS3Ref()
        if (!configGot)
            return

        const _return: S3Response = {
            status: 0,
            msg: '',
            data: null,
        }

        const output = await S3Ref.value!.getObject({
            Key: key,
            Bucket: import.meta.env.VITE_S3_BUCKET,
        })

        if (output.Body)
            _return.status = 1

        _return.data = output

        return _return
    }

    const getSingedUrl = async (key: string) => {
        if (!S3Ref.value)
            return
        const cmd = new GetObjectCommand({
            Key: key,
            Bucket: import.meta.env.VITE_S3_BUCKET,
        })
        return await getSignedUrl(S3Ref.value, cmd)
    }

    // 下载
    const downloadObject = async (key: string, rename?: string) => {
        const configGot = await ensureS3Ref()
        if (!configGot)
            return

        if (!rename && key) {
            const splitKey = key.split('/')
            rename = splitKey[splitKey.length - 1]
        }
        else if (rename && key) {
            const fileExtension = key.substring(key.lastIndexOf('.') + 1)
            rename += `.${fileExtension}`
        }

        const url = await getSingedUrl(key)
        if (!url) {
            return {
                status: 0,
                msg: t('request.failed_placeholder'),
            }
        }

        createDownload(url, rename)

        return {
            status: 1,
            msg: t('request.success_placeholder'),
        }
    }

    return {
        downloadObject,
        getObject,
        listObjects,
        putObject,
        deleteObject,
    }
}
