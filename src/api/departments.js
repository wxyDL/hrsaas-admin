// 组织架构的接口
// 引入request请求
import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 添加部门接口
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门详情的接口
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 修改部门详情
export function updateDeptDetail(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
