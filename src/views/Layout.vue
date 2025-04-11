<template>
  <a-layout class="layout-container">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" v-if="collapsed">
        <span v-else>乒乓球运动分析系统</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <a-menu-item v-for="route in mainRoutes" :key="'/' + route.path">
          <router-link :to="'/' + route.path">
            <template #icon><component :is="icons[route.meta.icon]" /></template>
            <span>{{ route.meta.title }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="header-container">
          <a-button
            type="text"
            @click="collapsed = !collapsed"
            class="menu-toggle"
          >
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
          <div class="header-right">
            <a-dropdown>
              <a class="user-info">
                <a-avatar :size="32" icon="user" />
                <span class="username">{{ userInfo.username || '用户' }}</span>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <UserOutlined /> 个人中心
                  </a-menu-item>
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined /> 退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        乒乓球运动分析系统 ©{{ new Date().getFullYear() }} Created by Team
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: 'LayoutPage'
}
</script>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  LineChartOutlined,
  BarChartOutlined,
  FileTextOutlined,
  LogoutOutlined,
  RobotOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 图标映射
const icons = {
  'home': HomeOutlined,
  'user': UserOutlined,
  'line-chart': LineChartOutlined,
  'bar-chart': BarChartOutlined,
  'file-text': FileTextOutlined,
  'robot': RobotOutlined
}

const collapsed = ref(false)
const selectedKeys = ref(['/' + route.path.split('/').filter(Boolean)[0]])

// 获取主路由
const mainRoutes = computed(() => {
  return router.options.routes.find(r => r.path === '/').children || []
})

// 监听路由变化并更新选中状态
watchEffect(() => {
  const currentPath = '/' + route.path.split('/').filter(Boolean)[0]
  selectedKeys.value = [currentPath]
})

// 获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.logo {
  height: 32px;
  margin: 16px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.logo img {
  height: 32px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.menu-toggle {
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.65);
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style> 