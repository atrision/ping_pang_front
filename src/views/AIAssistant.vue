<template>
  <div class="ai-assistant-container">
    <a-card title="AI助手" :bordered="false" class="assistant-card">
      <template #title>
        <a-tabs v-model="activeTab">
          <a-tab-pane key="normal" tab="标准模式"></a-tab-pane>
          <a-tab-pane key="streaming" tab="流式输出"></a-tab-pane>
        </a-tabs>
      </template>
      <template #extra>
        <a-button type="text" @click="createNewChat">
          <template #icon><PlusOutlined /></template>
          新对话
        </a-button>
      </template>
      
      <!-- 聊天主体区域 -->
      <div class="chat-container" v-if="activeTab === 'normal'">
        <!-- 欢迎消息 -->
        <div v-if="sortedMessages.length === 0" class="welcome-container">
          <div class="welcome-header">
            <RobotOutlined class="robot-icon" />
            <h2>乒乓球助手</h2>
          </div>
          <p class="welcome-text">您好，我是您的乒乓球分析助手。我可以帮助您解答关于乒乓球训练、数据分析和系统使用的问题。</p>
          <div class="suggested-questions">
            <h3>您可以尝试问我：</h3>
            <div class="question-buttons">
              <a-button @click="askSuggestedQuestion('如何分析我的乒乓球轨迹数据？')">如何分析我的乒乓球轨迹数据？</a-button>
              <a-button @click="askSuggestedQuestion('如何生成训练报告？')">如何生成训练报告？</a-button>
              <a-button @click="askSuggestedQuestion('如何提高我的反手技术？')">如何提高我的反手技术？</a-button>
              <a-button @click="askSuggestedQuestion('如何解读训练可视化图表？')">如何解读训练可视化图表？</a-button>
            </div>
          </div>
        </div>
        
        <!-- 消息列表 -->
        <div v-else class="messages-container" ref="messagesContainer">
          <div class="debug-info" v-if="isDevMode">
            <p>当前消息数量: {{ sortedMessages.length }}</p>
            <p>会话ID: {{ assistantStore.currentSessionId }}</p>
          </div>
          <chat-message 
            v-for="message in sortedMessages" 
            :key="message.id" 
            :message="message" 
          />
          
          <!-- 加载指示器 -->
          <div v-if="assistantStore.loading" class="loading-indicator">
            <a-spin />
            <span>AI正在思考中...</span>
          </div>
        </div>
        
        <!-- 错误提示 -->
        <a-alert 
          v-if="assistantStore.error" 
          type="error" 
          :message="assistantStore.error" 
          show-icon 
          class="error-alert"
        />
      </div>
      
      <div v-else-if="activeTab === 'streaming'" class="streaming-container">
        <streaming-chat-demo />
      </div>
      
      <!-- 聊天输入框 -->
      <chat-input 
        v-if="activeTab === 'normal'"
        :loading="assistantStore.loading" 
        :disabled="!!assistantStore.error" 
        @send="sendMessage" 
      />
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, nextTick, onMounted } from 'vue'
import { useAssistantStore } from '@/store/modules/assistant'
import ChatMessage from '@/components/AIAssistant/ChatMessage.vue'
import ChatInput from '@/components/AIAssistant/ChatInput.vue'
import StreamingChatDemo from '@/components/AIAssistant/StreamingChatDemo.vue'
import { PlusOutlined, RobotOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'AIAssistantPage',
  components: {
    ChatMessage,
    ChatInput,
    PlusOutlined,
    RobotOutlined,
    StreamingChatDemo
  },
  setup() {
    const assistantStore = useAssistantStore()
    const messagesContainer = ref(null)
    const activeTab = ref('normal')
    const isDevMode = ref(process.env.NODE_ENV === 'development')
    
    // 控制台打印初始状态
    console.log('初始状态:', {
      currentSessionId: assistantStore.currentSessionId,
      messagesCount: assistantStore.messages.length
    })
    
    // 计算属性：获取排序后的消息
    const sortedMessages = computed(() => {
      console.log('排序消息，当前消息数量:', assistantStore.messages.length);
      const sorted = assistantStore.sortedMessages;
      return sorted;
    })
    
    // 监听消息变化，自动滚动到底部
    watch(
      () => assistantStore.messages.length,
      async (newLength, oldLength) => {
        console.log('消息数量变化:', oldLength, '->', newLength);
        await nextTick()
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      }
    )
    
    // 发送消息
    const sendMessage = async (text) => {
      try {
        console.log('发送消息:', text);
        await assistantStore.sendUserMessage(text)
        console.log('消息发送成功, 当前消息数量:', assistantStore.messages.length);
      } catch (error) {
        console.error('发送消息失败:', error);
        message.error('发送消息失败，请稍后重试')
      }
    }
    
    // 创建新的聊天会话
    const createNewChat = async () => {
      try {
        console.log('创建新会话');
        await assistantStore.createNewSession()
        console.log('会话创建成功:', assistantStore.currentSessionId);
        message.success('已创建新的对话')
      } catch (error) {
        console.error('创建会话失败:', error);
        message.error('创建新对话失败')
      }
    }
    
    // 发送预设问题
    const askSuggestedQuestion = (question) => {
      sendMessage(question)
    }
    
    // 初始化：尝试加载或创建会话
    const initChat = async () => {
      console.log('初始化聊天');
      if (!assistantStore.currentSessionId) {
        try {
          console.log('无会话ID，创建新会话');
          await assistantStore.createNewSession()
          console.log('新会话创建成功:', assistantStore.currentSessionId);
        } catch (error) {
          console.error('初始化聊天失败:', error);
          message.error('初始化聊天失败')
        }
      } else {
        try {
          console.log('有会话ID，加载历史记录:', assistantStore.currentSessionId);
          await assistantStore.loadChatHistory()
          console.log('历史记录加载成功, 消息数量:', assistantStore.messages.length);
        } catch (error) {
          console.error('加载历史记录失败:', error);
          message.error('加载聊天记录失败')
        }
      }
    }
    
    // 页面加载时初始化
    onMounted(() => {
      console.log('组件挂载完成，初始化聊天');
      initChat();
    })
    
    return {
      assistantStore,
      sortedMessages,
      messagesContainer,
      sendMessage,
      createNewChat,
      askSuggestedQuestion,
      activeTab,
      isDevMode
    }
  }
})
</script>

<style scoped>
.ai-assistant-container {
  height: 100%;
  padding: 16px;
  background-color: #f0f2f5;
}

.assistant-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 300px;
  margin-bottom: 16px;
}

.welcome-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.welcome-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.robot-icon {
  font-size: 28px;
  margin-right: 8px;
  color: #1890ff;
}

.welcome-text {
  margin-bottom: 24px;
  font-size: 16px;
  color: #333;
  max-width: 600px;
}

.suggested-questions {
  margin-top: 24px;
  width: 100%;
}

.question-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.debug-info {
  background-color: #f8f8f8;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  border: 1px dashed #ccc;
}

.debug-info p {
  margin: 2px 0;
}

.loading-indicator {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: #999;
}

.loading-indicator span {
  margin-left: 8px;
}

.error-alert {
  margin-bottom: 16px;
}

/* 媒体查询：小屏幕优化 */
@media (max-width: 768px) {
  .ai-assistant-container {
    padding: 8px;
  }
  
  .question-buttons {
    flex-direction: column;
  }
}

.streaming-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style> 