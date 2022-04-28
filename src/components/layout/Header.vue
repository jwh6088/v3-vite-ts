<template>
    <div class="nav">
        <div class="logo" @click="goHome">
            <img src="@/assets/naivelogo.svg" />
            <span>Naive UI</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const goHome = (): void => {
    router.push({
        name: 'home',
    })
}
</script>

<style scoped lang="scss">
.nav {
    display: grid;
    font-size: 18px;

    .logo {
        display: flex;
        align-items: center;
        width: 120px;
        cursor: pointer;

        img {
            height: 32px;
            margin-right: 12px;
            width: 32px;
        }
    }
}
</style>