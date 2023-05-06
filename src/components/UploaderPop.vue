<template>
    <n-popover v-model:show="showPop" trigger="click">
        <template #trigger>
            <n-button
                :disabled="props.disabled"
                v-bind="{ ...props.triggerButtonProps }"
                @click="showPop = !showPop"
            >
                {{ props.triggerText ?? $t('button.import') }}
            </n-button>
        </template>
        <div p-4>
            <div>
                <n-form-item
                    :feedback="formError ? $t('validation.common.required') : ''"
                    :label="$t('page.tech.quality.recallActivity.template_file')"
                    :validation-status="formError ? 'error' : undefined"
                    label-placement="left"
                    required
                >
                    <NUpload
                        :ref="uploaderRef"
                        :accept="props.accept"
                        :custom-request="customRequest"
                        :default-upload="false"
                        :disabled="props.disabled"
                        :on-change="handleFileChange"
                        :show-file-list="false"
                        multiple
                        v-bind="{ ...props.uploadProps }"
                    >
                        <n-input-group>
                            <n-input
                                ref="input"
                                :placeholder="
                                    $t('page.tech.quality.recallActivity.no_file_selected')
                                "
                                :status="formError ? 'error' : undefined"
                                :value="fileName"
                                class="input-cursor-pointer"
                                readonly
                            />
                            <n-input-group-label cursor-pointer>
                                {{ $t('page.tech.quality.recallActivity.browse') }}
                            </n-input-group-label>
                        </n-input-group>
                    </NUpload>
                    <NButton
                        v-if="!!fileName"
                        absolute
                        style="right: -20px; top: 7px"
                        text
                        @click="clearFile"
                    >
                        <n-icon size="18">
                            <i-carbon-close style="color: #2080f0ff" />
                        </n-icon>
                    </NButton>
                </n-form-item>
            </div>
            <n-space justify="center" mt-1>
                <NButton
                    v-if="!hideDownloadBtn"
                    :disabled="props.disabled"
                    :loading="downloadLoading"
                    mr-2
                    type="primary"
                    @click="download()"
                >
                    {{ $t('page.tech.quality.recallActivity.download_template') }}
                </NButton>
                <NButton
                    :disabled="props.disabled"
                    :loading="importLoading"
                    mr-2
                    type="primary"
                    @click="importFile"
                >
                    {{ $t('button.confirm') }}
                </NButton>
                <NButton @click="showPop = false">
                    {{ $t('button.back') }}
                </NButton>
            </n-space>
        </div>
    </n-popover>
</template>

<script lang="ts" name="UploaderPop" setup>
import type {
    ButtonProps,
    UploadCustomRequestOptions,
    UploadFileInfo,
    UploadProps,
} from 'naive-ui';
import { NUpload, useDialog, useMessage } from 'naive-ui';
import type { PropType } from 'vue';
import type { AxiosRequestConfig } from 'axios';
import { functionRefWrapper } from '~/utils/helper';
import type { InstanceOrNull } from '~/utils/helper';
import { useResponseHandler } from '~/utils/http/handler';

const props = defineProps({
    accept: String,
    triggerText: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    templateName: String,
    uploadUrl: String,
    fileKey: {
        type: String,
        default: 'file',
    },
    uploadProps: {
        type: Object as PropType<UploadProps>,
    },
    closeAfterFinished: {
        type: Boolean,
        default: true,
    },
    clearAfterFinished: {
        type: Boolean,
        default: true,
    },
    clearOnPopClose: {
        type: Boolean,
        default: true,
    },
    triggerButtonProps: {
        type: Object as PropType<ButtonProps>,
    },
    downloadTemplateUrl: {
        type: String,
        default: '',
    },
    customError: {
        // 是否自行处理异常返回
        type: Boolean,
        default: false,
    },
    hideDownloadBtn: {
        // 是否隐藏下载模板按钮
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['importError', 'onSuccess']);

const { postForm } = useApis();
const { handler } = useResponseHandler();

const downloadLoading = ref(false);
const download = () => {};
// const { loading: downloadLoading, download } = downloadTemplate(
//     () => props.templateName,
//     props.downloadTemplateUrl,
// );
const importLoading = ref(false);
const showPop = ref(false);
const fileName = ref('');
const uploader = ref<InstanceOrNull<typeof NUpload>>(null);
const uploaderRef = functionRefWrapper(uploader);
const formError = ref(false);

const clearFile = () => {
    if (uploader.value) {
        uploader.value.clear();
        fileName.value = '';
    }
};
watch(showPop, (v) => {
    if (props.clearOnPopClose && !v) {
        clearFile();
    }
});
const importFile = () => {
    if (!fileName.value) {
        formError.value = true;
        return;
    }
    uploader.value?.submit();
};
const handleFileChange = (options: { fileList: UploadFileInfo[] }) => {
    const { fileList } = options;
    if (fileList.length > 1) fileList.shift();
    fileName.value = fileList[0].name;
    formError.value = false;
};
const { t } = useI18n();
const dialog = useDialog();
const message = useMessage();
const customRequest = ({
    file,
    data,
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
}: // onProgress,
UploadCustomRequestOptions) => {
    if (!action && !props.uploadUrl) {
        console.warn('you have not set uploadUrl/action');
        return;
    }
    importLoading.value = true;
    const config = {
        withCredentials,
    } as AxiosRequestConfig;
    if (headers) config.headers = headers as Record<string, string>;
    postForm<{}, undefined>(
        (action ?? props.uploadUrl) as string,
        { [props.fileKey]: file.file, ...data },
        config,
    )
        .then(async (res) => {
            await handler<undefined>(res, {
                onSuccess: () => {
                    if (props.clearAfterFinished && !props.clearOnPopClose) clearFile();
                    if (props.closeAfterFinished) showPop.value = false;
                    console.log('执行');
                    emit('onSuccess', res);
                    onFinish();
                },
                onError: (err) => {
                    if (props.customError) {
                        emit('importError', err);
                        return;
                    }
                    if (err.res) {
                        dialog.warning({
                            title: t('dialog.error_message'),
                            content:
                                typeof err.res == 'string'
                                    ? err.res
                                    : () =>
                                        h(
                                            'div',
                                            err.res?.map(
                                                (message: { errorMsg: string } | string) =>
                                                    h(
                                                        'div',
                                                        typeof message !== 'string'
                                                            ? message?.errorMsg
                                                            : message,
                                                    ),
                                            ),
                                        ),
                        });
                    } else if (err.code === 50000) {
                        message.error(err.msg as string);
                    } else {
                        message.warning(err.msg as string);
                    }
                },
                // onError,
                successMessage: true,
                errMessage: false,
            });
        })
        .finally(() => {
            importLoading.value = false;
        });
};
</script>
