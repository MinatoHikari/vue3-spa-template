<script lang="ts" setup name="AuthLogin">
import { useForm } from '~/pages/auth/login/modules/useForm'
import { useVerifyCode } from '~/pages/auth/login/modules/useVerifyCode'

const { formData, login, onLoginError } = useForm()

const { verifyCodeUrl, refreshVerifyCode } = useVerifyCode()

onLoginError(() => {
    refreshVerifyCode()
})
</script>

<template>
    <div class="page-container">
        <n-space justify="center" align="center">
            <div w-100 mt-30>
                <div text-center font-bold text-2xl>
                    {{ $t('auth.login') }}
                </div>
                <div text-left>
                    <n-form-item :label="$t('auth.username')">
                        <n-input
                            v-model:value="formData.username"
                            type="text"
                            :placeholder="$t('auth.username_placeholder')"
                            @keyup.enter="login"
                        />
                    </n-form-item>
                    <n-form-item :label="$t('auth.password')">
                        <n-input
                            v-model:value="formData.password"
                            type="password"
                            show-password-on="mousedown"
                            :placeholder="$t('auth.password_placeholder')"
                            @keyup.enter="login"
                        />
                    </n-form-item>
                    <n-form-item :label="$t('auth.code')">
                        <n-input
                            v-model:value="formData.code"
                            :placeholder="$t('auth.code_placeholder')"
                            @keyup.enter="login"
                        />
                    </n-form-item>
                </div>
                <n-card w-28 content-style="padding: 0;">
                    <div text-center>
                        <n-image
                            preview-disabled
                            cursor-pointer
                            width="100"
                            height="48"
                            :src="verifyCodeUrl"
                            @click="refreshVerifyCode"
                        />
                    </div>
                </n-card>

                <n-space justify="center">
                    <n-button m-4 w-20 type="info" ghost class="button" @click="login">
                        {{ $t('auth.login') }}
                    </n-button>
                </n-space>
            </div>
        </n-space>
    </div>
</template>

<style scoped>
.n-card {
    margin: 0 auto;
    height: 50px;
}
.button {
    background-color: rgba(0, 37, 92);
    color: white;
}
</style>

<style scoped>
</style>

<route lang="yaml">
meta:
    layout: auth
</route>
