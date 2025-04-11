<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面找不到了</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <a-button type="primary" @click="goHome">
        返回首页
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.content {
  text-align: center;
  padding: 32px;
}

h1 {
  font-size: 72px;
  font-weight: bold;
  color: #1890ff;
  margin: 0;
  line-height: 1.2;
}

h2 {
  font-size: 24px;
  color: #333;
  margin: 16px 0;
}

p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}
</style> 