<template>
  <div class="chat-message" :class="[message.role]">
    <div class="message-content">
      <!-- 头像区域 -->
      <div class="avatar">
        <a-avatar :size="40">
          <template #icon v-if="message.role === 'assistant'">
            <RobotOutlined />
          </template>
          <template #icon v-else>
            <UserOutlined />
          </template>
        </a-avatar>
      </div>
      
      <!-- 消息内容区域 -->
      <div class="content-wrapper">
        <div class="message-header">
          <span class="sender-name">{{ senderName }}</span>
          <span class="message-time">{{ formattedTime }}</span>
        </div>
        <div class="message-body">
          {{ message.content || '无内容' }}
        </div>
        <div class="message-debug" v-if="showDebug">
          <pre>ID: {{ message.id }}</pre>
          <pre>Role: {{ message.role }}</pre>
          <pre>Time: {{ message.timestamp }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { UserOutlined, RobotOutlined } from '@ant-design/icons-vue'
import { formatDate } from '@/utils'

export default defineComponent({
  name: 'ChatMessage',
  components: {
    UserOutlined,
    RobotOutlined
  },
  props: {
    message: {
      type: Object,
      required: true,
      // 消息对象结构示例
      default: () => ({
        id: '',
        content: '',
        timestamp: '',
        role: 'user' // 'user' 或 'assistant'
      })
    }
  },
  setup(props) {
    // 开发环境下显示调试信息
    const showDebug = ref(process.env.NODE_ENV === 'development');
    
    console.log('渲染消息:', JSON.stringify(props.message));
    
    return {
      showDebug
    };
  },
  computed: {
    senderName() {
      return this.message.role === 'assistant' ? 'AI助手' : '我'
    },
    formattedTime() {
      return formatDate(this.message.timestamp, 'HH:mm:ss')
    }
  }
})
</script>

<style scoped>
.chat-message {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
}

.message-content {
  display: flex;
  max-width: 80%;
}

.chat-message.user {
  align-items: flex-end;
}

.chat-message.user .message-content {
  flex-direction: row-reverse;
}

.chat-message.assistant .message-content {
  align-self: flex-start;
}

.avatar {
  margin: 0 8px;
}

.content-wrapper {
  background-color: #f0f2f5;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
}

.chat-message.user .content-wrapper {
  background-color: #1890ff;
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.chat-message.user .message-header {
  color: rgba(255, 255, 255, 0.85);
}

.message-body {
  word-break: break-word;
  line-height: 1.5;
}

.message-debug {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ccc;
  font-size: 10px;
  color: #999;
}

.message-debug pre {
  margin: 0;
  line-height: 1.2;
}

.sender-name {
  font-weight: 500;
}

.message-time {
  margin-left: 8px;
  color: #999;
}

.chat-message.user .message-time {
  color: rgba(255, 255, 255, 0.75);
}
</style> 