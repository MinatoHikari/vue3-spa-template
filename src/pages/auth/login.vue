<template>
    <div class="h-full">
        <n-grid x-gap="12" :cols="3">
            <n-gi/>
            <n-gi>
                <n-space justify="center">
                    <n-card class="w-120 mt-30">
                        <div class="text-center font-bold text-2xl">登录</div>
                        <n-form-item label="用户名">
                            <n-input
                                v-model:value="formData.userName"
                                type="text"
                                placeholder="请输入用户名"
                            />
                        </n-form-item>
                        <n-form-item label="密码">
                            <n-input
                                v-model:value="formData.password"
                                type="password"
                                show-password-on="mousedown"
                                placeholder="请输入密码"
                            />
                        </n-form-item>
                        <n-space justify="center">
                            <n-button class="w-20" type="info" ghost @click="login">确定</n-button>
                        </n-space>
                    </n-card>
                </n-space>
            </n-gi>
            <n-gi/>
        </n-grid>
    </div>
</template>

<script lang="ts" src="./scripts/login.ts"></script>

<style scoped></style>

<route lang="yaml">
meta:
    layout: auth
</route>
