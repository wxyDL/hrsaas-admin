// 引入cookie存储token
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 引入api中的接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'

const state = {
  // 获取token
  token: getToken(),
  // 用户信息对象
  userInfo: {}
}
const mutations = {
  // 设置token
  setToken(state, token) {
    // 改变state中的token
    state.token = token
    // 将state中的token存储到持久化中
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    // 将state中的token设为null
    state.token = null
    // 将持久化里的token清除
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 登录的方法
  async login(context, data) {
    // 调用登录接口
    const result = await login(data)
    // 登录成功把token提交到mutations中
    context.commit('setToken', result)
    // 登录成功设置token的时间戳
    setTimeStamp()
  },
  // 获取用户信息
  async getUserInfo(context) {
    // 调用获取用户信息的接口
    const result = await getUserInfo()
    // 调用获取用户头像的接口
    const staffPhoto = await getUserDetailById(result.userId)
    // 把用户信息提交到mutations中
    context.commit('setUserInfo', { ...result, ...staffPhoto })
    return result
  },
  // 退出登录的方法
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
