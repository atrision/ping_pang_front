<!--
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-28 20:10:00
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-29 21:04:27
 * @FilePath: \网页端\web_app\src\components\AIAssistant\ChatInput.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="chat-input">
    <a-form @submit.prevent="handleSend" class="input-form">
      <a-textarea
        v-model:value="message"
        placeholder="请输入您想询问的问题..."
        :rows="2"
        :disabled="disabled"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        @keypress.enter.prevent="handleKeyPress"
      />
      <div class="input-actions">
        <a-button 
          type="primary" 
          :disabled="isDisabled" 
          :loading="loading"
          @click="handleSend"
        >
          <template #icon><SendOutlined /></template>
          发送
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { SendOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'ChatInput',
  components: {
    SendOutlined
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send'],
  setup(props, { emit }) {
    const message = ref('')

    const isDisabled = computed(() => {
      return props.disabled || props.loading || !message.value.trim()
    })

    const handleSend = () => {
      if (isDisabled.value) return
      
      const trimmedMessage = message.value.trim()
      if (trimmedMessage) {
        emit('send', trimmedMessage)
        message.value = ''
      }
    }

    const handleKeyPress = (e) => {
      // 如果按下 Enter 键且没有同时按下 Shift 键，发送消息
      if (e.key === 'Enter' && !e.shiftKey) {
        handleSend()
      }
    }

    return {
      message,
      isDisabled,
      handleSend,
      handleKeyPress
    }
  }
})
</script>

<style scoped>
.chat-input {
  border-top: 1px solid #e8e8e8;
  padding: 12px;
  background-color: #fff;
}

.input-form {
  display: flex;
  flex-direction: column;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style> 