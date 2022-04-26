<script lang="ts" setup>
import { reactive } from 'vue'
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counters"
import { get, post } from '@/utils/axios'

const counter = useCounterStore();
const { count } = storeToRefs(counter);

const obj = reactive({})

const postRequest = async (): Promise<void> => {
    const res = await post("/taskStationInformation/list/stationType", { test: "123213" })
}

const getRequest = async (): Promise<void> => {
    const res = await get("/taskStationInformation/list/stationType")
    console.log(res)
}
</script>

<template>
    <section>
        <n-button @click="counter.increment()">{{ count }}</n-button>
        <n-button @click="postRequest">post</n-button>
        <n-button @click="getRequest">get</n-button>
    </section>
</template>