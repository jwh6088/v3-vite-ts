import Axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

const BASE_URL: string = 'https://stg.huiliu365.cn'
const TIME_OUT: number = 10 * 1000

const instance: any = Axios.create({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
})

instance.interceptors.response.use(
    (res: AxiosResponse) => {
        if (String(res.status).indexOf('2') !== 0) {
            return {
                code: res.status,
                message: res.data.message || '请求异常，请刷新重试',
                result: false
            }
        }
        return Promise.resolve(res.data)
    },
    (error: AxiosError) => {
        if (error && error.response) {
            errorHandle(error.response.status, error.response)
            return Promise.reject(error.response)
        }
        console.log('网络请求失败, 请刷新重试')
        return Promise.reject(error)
    }
)

const errorHandle = (status: number, error: any): void => {
    // HTTP状态码判断
    switch (status) {
        case 401:
            return alert(`Error Code: ${status}, Message: ${error.msg || '登录失效，请重新登录'}`)
        case 403:
            return alert(`Error Code: ${status}, Message: ${error.msg || '你没有访问权限'}`)
        case 500:
            return alert(`Error Code: ${status}, Message: ${error.msg || '后台错误，请联系管理员'}`)
        case 502:
            return alert(`Error Code: ${status}, Message: ${error.msg || '平台环境异常'}`)
        default:
            alert(`Error Code: ${status}, Message: ${error.msg || '未知错误，请刷新重试'}`)
    }
}

const getPromise = (method: string, url: string, params: object, config = {}) => {
    return new Promise((resolve, reject) => {
        instance[method](url, params).then((res: object) => resolve(res)).catch((err: object) => reject(err))
    })
}

const get = (url: string, params?: any) => getPromise('get', url, { params })
const post = (url: string, params: any, config?: AxiosRequestConfig) => getPromise('post', url, params, config)

export {
    get,
    post,
}