import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    redirect: '/home',
    name: 'layout', // 如果有默认子路由 父级 name 没有意义
    component: () => import('@/views/layout'),
    children: [
      { path: 'home', name: 'home', component: () => import('@/views/home') }, // 默认子路由
      { path: 'qa', name: 'qa', component: () => import('@/views/qa') },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      { path: 'my', name: 'my', component: () => import('@/views/my') }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/author/user/:authorId',
    name: 'author-user',
    component: () => import('@/views/author-user'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path: '/myCollectOrHistory/:activeIndex',
    name: 'myCollectOrHistory',
    component: () => import('@/views/myCollectOrHistory'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
