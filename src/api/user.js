import request from '@/utils/request'

// 登录接口
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {

}

// 获取用户头像接口
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
