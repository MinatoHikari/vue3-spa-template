<script setup lang="ts">
import { start } from 'qiankun'

onMounted(() => {
    if (!(window as unknown as { qiankunStarted: boolean }).qiankunStarted) {
        (window as unknown as { qiankunStarted: boolean }).qiankunStarted = true
        start()
    }
})
</script>

<template>
    <div>
        <div id="service" />
    </div>
</template>

<style scoped></style>
