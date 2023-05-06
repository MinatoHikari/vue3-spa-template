<template>
    <div>
        <div id="service" />
    </div>
</template>

<script setup lang="ts">
import { start } from 'qiankun';

onMounted(() => {
    if (!(window as unknown as { qiankunStarted: boolean }).qiankunStarted) {
        (window as unknown as { qiankunStarted: boolean }).qiankunStarted = true;
        start();
    }
});
</script>

<style scoped></style>
