import axios from 'axios'
import { useUserStore } from '@/stores'
// js文件里面想要使用element-plus也是要引入的，因为js文件不是组件
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 100000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      // 有token，在请求头加上token
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) { // 成功响应
      return res
    }
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 到这里说明一定出错了
    // 错误的特殊情况：401，权限不足，或登录过期
    if (error.response?.status === 401) {
      router.push('/login')
      // 这里的router是自己建好的router，而不是vue的router包
    }

    // 错误默认情况：只要给提示
    ElMessage.error(error.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }