<template>
    <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" :default-value="routeName"
        :watch-props="['defaultValue']" @update:value="handleUpdateValue" />
</template>

<script setup lang="ts">
import { h, watchEffect, ref, Component } from 'vue'
import { NIcon, useMessage } from 'naive-ui'
import { BookOutline as BookIcon, MapOutline } from '@vicons/ionicons5'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'

const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'avatar',
                }
            },
            { default: () => '头像 Avatar' }
        ),
        key: 'avatar',
        icon: renderIcon(BookIcon)
    },
    {
        label: '通用组件',
        key: '',
        icon: renderIcon(BookIcon),
        children: [
            {
                label: () => h(
                    RouterLink,
                    {
                        to: {
                            name: 'form',
                        }
                    },
                    { default: () => '表单组件' }
                ),
                key: 'form'
            },
            {
                label: () => h(
                    RouterLink,
                    {
                        to: {
                            name: 'table',
                        }
                    },
                    { default: () => '表格组件' }
                ),
                key: 'table'
            }
        ]
    },
    {
        label: 'Axios示例',
        key: 'a-wild-sheep-chase',
        disabled: true,
        icon: renderIcon(BookIcon)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'map',
                }
            },
            { default: () => '地图SDK' }
        ),
        key: 'map',
        icon: renderIcon(MapOutline)
    },
]

// 监听路由高亮菜单
const routeName = ref()
const route = useRoute()
watchEffect(() => {
    routeName.value = route.name

})

// const message = useMessage()
const handleUpdateValue = (key: string, item: MenuOption) => {
    // message.info('[onUpdate:value]: ' + JSON.stringify(key))
    // message.info('[onUpdate:value]: ' + JSON.stringify(item))
}
</script>

<style scoped lang="scss">
</style>