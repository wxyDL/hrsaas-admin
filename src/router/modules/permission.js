// 引入layout布局
import Layout from '@/layout'
export default {
  path: '/permission',
  component: Layout,
  name: 'permission',
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
