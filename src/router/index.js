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
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '选项', icon: 'dashboard' }
  //   }]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/team',
    children: [
      {
        path: '',
        name: 'team',
        component: () => import('@/views/Team/MyTeam/myTeam')
      }
    ]
  },
  {
    path: '/teamDetail',
    component: Layout,
    children: [
      {
        path: '',
        name: 'teamDetail',
        component: () => import('@/views/Team/teamDetail/teamDetail'),
        meta: { title: '成员管理', icon: 'person' }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    meta: { title: '项目管理', icon: 'project' },
    children: [
      {
        path: 'all_new',
        name: 'all_project',
        component: () => import('@/views/MyProject/projects/project_new'),
        meta: { title: '所有项目(新）', icon: 'projects' }
      },
      {
        path: 'all',
        name: 'all_project',
        component: () => import('@/views/MyProject/projects/index'),
        meta: { title: '所有项目', icon: 'projects' }
      },
      {
        path: 'recycle_bin',
        name: 'recycle_bin',
        component: () => import('@/views/MyProject/projects/trash_bin'),
        meta: { title: '回收站', icon: 'trash-bin' }
      }
    ]
  },
  {
    path: '/project_detail',
    name: 'project_detail',
    component: () => import('@/views/MyProject/projects/detail')
  },
  {
    path: '/design',
    name: 'design',
    component: () => import('@/views/MyProject/projects/MyDesign/model')
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
        component: () => import('@/views/MyProject/projects/MyDoc/createDoc'),
        meta: { title: '新建文档', icon: 'form' }
      },
      {
        path: 'documents',
        name: 'documents',
        component: () => import('@/views/MyProject/projects/MyDoc/showDocs'),
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
