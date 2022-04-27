<template>
    <div class="map-box">
        <div id="container"></div>
        <!-- 地理位置查询 -->
        <div class="map-box-search">
            <n-input v-model:value="mapSearchValue" type="text" placeholder="地理位置搜索" @keyup.enter.native="mapSearch" />
            <div id="panel"></div>
        </div>
        <!-- 站点弹窗 -->
        <n-modal v-model:show="showModal">
            <n-card style="width: 600px" :title="markerInof.title" :bordered="false" size="huge" role="dialog"
                aria-modal="true">
                {{ markerInof }}
            </n-card>
        </n-modal>
        <!-- 站点列表 -->
        <n-collapse :default-expanded-names="['1']" class="map-box-list">
            <n-collapse-item title="站点列表" name="1">
                <n-input v-model:value="searchValue" type="text" placeholder="地图标注搜索" class="map-box-list-search"
                    @keyup.enter.native="onSearch" />
                <div v-for="item in _markerArray" class="map-box-list-item" @click="markerPosition(item)">{{ item.title
                }}</div>
            </n-collapse-item>
        </n-collapse>
    </div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { shallowRef, ref, reactive } from '@vue/reactivity'
import { onMounted } from 'vue'

// 初始化地图
const map = shallowRef({
    setCenter: ([]) => { }
})
const AMap = ref()
const AMapPlaceSearch = shallowRef({   // 对象数据，后续功能不会修改该对象中的属性，而是生成新的对象来替换，所以用shallowRef
    search: (value: any) => { }
})
const initMap = (): void => {
    AMapLoader.load({
        key: "86d386aee05657abfc3f05624a7ec48a",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Geocoder', 'AMap.PlaceSearch']     // 需要使用的的插件列表 AMap.Geocoder地理编码 AMap.PlaceSearch地点搜索服务
    }).then((_AMap) => {
        AMap.value = _AMap
        map.value = new AMap.value.Map("container", {  // 设置地图容器id
            viewMode: "2D",    // 地图模式
            zoom: 11,           // 初始化地图级别
            // center: [116.39729966137693, 39.90810018665696], // 初始化地图中心点位置
            resizeEnable: true
        });
        // 添加点标记
        addMarker(map.value, AMap.value)
        // 添加列表
        _markerArray.value = markerArray
        // 构造查询类
        AMapPlaceSearch.value = new AMap.value.PlaceSearch({
            map: map.value, // 展现结果的地图实例
            panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        })
    }).catch(e => {
        console.log(e);
    })
}
onMounted(() => {
    initMap()
})

// 模拟站点经纬度
interface MarkerList {
    title: string,
    lnglat: string,
    content: string
}
const markerArray = reactive<Array<MarkerList>>([
    { title: "通惠大厦站点", lnglat: "北京市朝阳区通惠大厦", content: "通惠大厦站点相关信息" },
    { title: "天安门站点", lnglat: "北京市东城区天安门", content: "天安门站点相关信息" },
    { title: "潍坊市站点", lnglat: "山东省潍坊市潍坊火车站", content: "站点3相关信息" },
    // { title: "站点4", lnglat: [116.33018006298826, 39.82825742321834], content: "站点4相关信息" },
    // { title: "站点5", lnglat: [116.46888245556639, 39.88834578068886], content: "站点5相关信息" },
])

// 添加点标记
const addMarker = (map: any, AMap: any) => {
    // 先同步编码
    markerArray.forEach(async item => {
        const res = await geocoder(item.lnglat)
        // 再添加点标记对象
        map.add(
            new AMap.Marker({
                position: new AMap.LngLat(res.lng, res.lat), // 点标记经纬度
                label: { content: item.title } // 点标记内容
            })
                // 绑定点击事件
                .on("click", (e: any) => showMarkerInfo(e, item))
        )
    })
}

// 站点详细信息
const showModal = ref(false)
const markerInof = reactive<MarkerList>({
    title: "",
    lnglat: "",
    content: ""
})
const showMarkerInfo = (e: any, content: MarkerList) => {
    showModal.value = true
    Object.assign(markerInof, content)
}

// 地理位置编码  如果地址有省市区则不用指定city
interface Lnglat {
    lng: string,
    lat: string
}
const geocoder = (address: string, city?: string) => {
    return new Promise<Lnglat>((resolve, reject) => {
        new AMap.value.Geocoder({})  // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            // 正向地理编码函数
            .getLocation(address, (status: string, result: any) => {
                if (status === 'complete' && result.info === 'OK') {
                    // result中对应详细地理坐标信息
                    const { location } = result.geocodes[0]
                    resolve({ lng: location.lng, lat: location.lat })
                } else {
                    reject()
                }
            })
    })
}

// 点标记定位
const markerPosition = async (val: MarkerList) => {
    // 地理编码
    const res = await geocoder(val.lnglat)
    // 通过设置地图中心点移动到指定经纬度
    map.value.setCenter([res.lng, res.lat]);
}

// 站点查询
const searchValue = ref()
const _markerArray = ref()
const onSearch = () => {
    if (searchValue.value) {
        _markerArray.value = markerArray.filter(item => {
            return item.title.indexOf(searchValue.value) != -1
        })
    } else {
        _markerArray.value = markerArray
    }
    // 移动到查询结果第一项的经纬度
    _markerArray.value[0] && markerPosition(_markerArray.value[0])
}

// 地理位置查询 - 关键字
const mapSearchValue = ref<string>()
const mapSearch = () => {
    //关键字查询
    AMapPlaceSearch.value.search(mapSearchValue.value)
}


</script>

<style  scoped>
#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 600px;
}

#panel {
    background-color: white;
    max-height: 500px;
    overflow-y: auto;

    width: 100%;
}

.map-box {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 600px;
}

.map-box-search {
    position: absolute;
    top: 45px;
    right: 45px;
    width: 400px;
}

.map-box-list {
    position: absolute;
    top: 45px;
    left: 45px;
    background-color: #fff;
    width: 300px;
    padding: 10px;
}

.map-box-list-item {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    font-weight: bold;
    cursor: pointer;
}
</style>