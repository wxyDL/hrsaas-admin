// 引入路由设置导航守卫
import router from './router'
// 引入vuex
import store from './store'
// 定义一个不被token限制的白名单
const whiteList = ['/login', '/404']
// 引入进度条的组件
import NProgress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 前置导航守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 判断有没有token
  if (store.getters.token) {
    // 判断是不是跳转登录页
    if (to.path === '/login') {
      // 直接跳转主页
      next('/')
    } else {
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      // 如果有token，又不是跳转登录页就直接放行
      next()
    }
  } else {
    // 判断是不是访问的白名单
    if (whiteList.indexOf(to.path) > -1) {
      // 是访问白名单就之间放行
      next()
    } else {
      // 不是白名單就跳转到登录页
      next('/login')
    }
  }
  //   手动关闭进度条
  NProgress.done()
})

// 后置导航守卫
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})
