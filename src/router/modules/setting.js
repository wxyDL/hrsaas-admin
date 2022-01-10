// 引入layout布局
import Layout from '@/layout'
export default {
  path: '/setting',
  component: Layout,
  name: 'setting',
  children: [
    {
      path: '',
      component: () => import('@/views/setting'),
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
