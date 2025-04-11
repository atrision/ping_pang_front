import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'trajectory-analysis',
        name: 'TrajectoryAnalysis',
        component: () => import('@/views/TrajectoryAnalysis.vue'),
        meta: { title: '轨迹分析', icon: 'line-chart' }
      },
      {
        path: 'training-visualization',
        name: 'TrainingVisualization',
        component: () => import('@/views/TrainingVisualization.vue'),
        meta: { title: '训练数据可视化', icon: 'bar-chart' }
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: { title: '用户数据管理', icon: 'user' }
      },
      {
        path: 'training-report',
        name: 'TrainingReport',
        component: () => import('@/views/TrainingReport.vue'),
        meta: { title: '训练报告生成', icon: 'file-text' }
      },
      {
        path: 'ai-assistant',
        name: 'AIAssistant',
        component: () => import('@/views/AIAssistant.vue'),
        meta: { title: 'AI助手', icon: 'robot' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 乒乓球运动分析系统` : '乒乓球运动分析系统'
  
  // 登录验证逻辑
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && to.path !== '/register' && !token) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router 