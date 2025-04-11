<!--
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-19 14:38:22
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-19 16:05:19
 * @FilePath: \web_app\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { nextTick } from 'vue'

export default {
  name: 'App',
  mounted() {
    nextTick(async () => {
      await nextTick()
      setTimeout(() => {
        
      }, 100)
    })
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.85);
  background-color: #f0f2f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
