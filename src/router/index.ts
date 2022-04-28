import {
    createRouter, createWebHashHistory, RouteRecordRaw,
} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', name: 'layout', component: () => import('components/layout/index.vue'),
        children: [
            { path: '', name: 'home', component: () => import('views/Home.vue') },
            { path: 'avatar', name: 'avatar', component: () => import('views/Avatar.vue') },
            { path: 'form', name: 'form', component: () => import('views/Form.vue') },
            { path: 'table', name: 'table', component: () => import('views/Table.vue') },
            { path: 'map', name: 'map', component: () => import('views/Map.vue') },
            // mirco子应用 react-components
            { path: 'react-components/:page*', name: 'react-components', component: () => import('views/ReactComponents.vue') }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),    // history 模式则使用 createWebHistory()
    routes,
})

export default router