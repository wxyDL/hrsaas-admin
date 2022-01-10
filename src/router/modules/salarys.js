// 引入layout布局
import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  name: 'salarys',
  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'money'
      }
    }
  ]
}
