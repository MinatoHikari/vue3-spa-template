<script setup lang="ts">
import { useCommonStore } from '~/stores/common';
import { useUserStore } from '~/stores/user';

const router = useRouter();
const commonStore = useCommonStore();
const userStore = useUserStore();
const { homepage } = useHomePage();

const next = async () => {
    if (!commonStore.authToken) router.push('/auth/login');
    else {
        await userStore.getUserInfo();

        await commonStore.reFetchRoutes();

        await router.push(homepage.value);
    }
};

onMounted(() => {
    next();
});
</script>

<template>
    <div />
</template>

<route lang="yaml">
meta:
    layout: home
</route>
