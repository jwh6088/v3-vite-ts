<template>
    <n-layout>
        <n-layout-header bordered class="layout-header">
            <Header />
        </n-layout-header>
        <n-layout has-sider class="layout-content">
            <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="240"
                :native-scrollbar="false">
                <Menu />
            </n-layout-sider>
            <n-layout :native-scrollbar="false">
                <router-view></router-view>
            </n-layout>
        </n-layout>
    </n-layout>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Menu from './Menu.vue'
</script>

<style scoped lang="scss">
.layout-header {
    height: 60px;
    display: grid;
    padding: 0 32px;
}

.layout-content {
    height: calc(100vh - 60px);
}
</style>