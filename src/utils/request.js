// 引入axios
import axios from 'axios'
// 引入element-ui中的提示消息对象
import { Message } from 'element-ui'
// 引入vuex的store
import store from '@/store'
// 引入token的时间戳
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
// 设置token超时时间
const timeOut = 3600

// 创建一个axios的实例
const service = axios.create({
  // 发开环境变量
  baseURL: process.env.VUE_APP_BASE_API,
  //   服务器响应时间
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 判断请求的时候有没有token
  if (store.getters.token) {
    // 判断token有没有超时
    if (isTimeStamp()) {
      // 调用退出登录的方法删除token和用户信息
      store.dispatch('user/logout')
      // 跳转登录页
      router.push('/login')
      // 提示token超时信息
      return Promise.reject(new Error('token超时了'))
    }
    // 如果有token就注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  // 请求失败，返回执行请求失败的操作
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  // 判断登录的时候是不是成功
  if (success) {
    // 成功返回token
    return data
  } else {
    //   提示登录失败信息
    Message.error(message)
    // 返回执行错误，跳出then，进入catch
    Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/')
  } else {
    // 提示错误信息
    Message.error(error.message)
  }
  //   返回执行错误，跳出then，进入catch
  return Promise.reject(error)
})

// 计算token超时时间
function isTimeStamp() {
  // 计算当前时间
  const currentTime = Date.now()
  // 获取token的时间戳
  const tokenTime = getTimeStamp()
  return (currentTime - tokenTime) / 1000 > timeOut
}
// 导出axios的实例
export default service
