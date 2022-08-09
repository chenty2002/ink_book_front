import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '选项', icon: 'dashboard' }
    }]
  },
  {
    path: '/team',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'team',
        component: () => import('@/views/Team/MyTeam/myTeam'),
        meta: { title: '团队', icon: 'team' }
      },
      {
        path: 'teamDetail',
        name: 'teamDetail',
        component: () => import('@/views/Team/teamDetail/teamDetail'),
        hidden: true
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'project',
        component: () => import('@/views/MyProject/index'),
        meta: { title: '项目', icon: 'project' }
      }
    ]
  },
  {
    path: '/design',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'design',
        component: () => import('@/views/MyDesign/index'),
        meta: { title: '设计原型', icon: 'design' }
      }
    ]
  },
  {
    path: '/doc',
    name: '文档',
    component: Layout,
    meta: { title: '文档管理', icon: 'document' },
    children: [
      {
        path: 'createDoc',
        name: 'createDoc',
        component: () => import('@/views/MyDoc/createDoc'),
        meta: { title: '新建文档', icon: 'form' }
      },
      {
        path: 'documents',
        name: 'documents',
        component: () => import('@/views/MyDoc/showDocs'),
        meta: { title: '所有文档', icon: 'documents' }

      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
