// 公司设置接口
import request from '@/utils/request'

// 获取角色的接口
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 获取公司的信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 删除角色信息接口
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 通过id获取角色的信息
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 更新角色的接口
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 新增角色
export function addRoles(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
