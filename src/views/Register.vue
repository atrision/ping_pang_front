<!--
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-19 15:16:32
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-19 15:42:45
 * @FilePath: \web_app\src\views\Register.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="register-container"></div>
</template>

<script>
export default {
  name: 'RegisterPage'
}
</script>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 直接重定向到登录页面的注册标签页
  router.replace({
    path: '/login',
    query: { tab: 'register' }
  })
})
</script>

<style scoped>
.register-container {
  display: none;
}
</style> 