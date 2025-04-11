<template>
  <div class="streaming-chat-demo">
    <h3>流式输出演示</h3>
    
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
          <div class="message-content" v-html="formatMessage(message.content)"></div>
        </div>
        
        <!-- 正在输出的消息 -->
        <div v-if="isStreaming" class="message ai-message streaming">
          <div class="message-content" v-html="formatMessage(streamingContent)"></div>
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      
      <div class="input-container">
        <a-input 
          v-model="userInput"
          placeholder="请输入您的问题..." 
          :disabled="isStreaming"
          @keyup.enter="sendMessage"
        />
        <a-button 
          type="primary" 
          :loading="isStreaming" 
          :disabled="!userInput.trim()" 
          @click="sendMessage"
        >
          发送
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick, watch } from 'vue';
import { createSession, getStreamingResponse } from '@/api/assistant';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'StreamingChatDemo',
  
  setup() {
    // 聊天消息列表
    const messages = ref([]);
    // 用户输入
    const userInput = ref('');
    // 是否正在流式输出
    const isStreaming = ref(false);
    // 当前正在输出的内容
    const streamingContent = ref('');
    // 消息容器引用，用于自动滚动
    const messagesContainer = ref(null);
    // 会话ID
    const sessionId = ref('');
    
    // 监听消息变化，自动滚动到底部
    watch(
      [() => messages.value.length, streamingContent],
      async () => {
        await nextTick();
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      }
    );
    
    // 初始化：创建新会话
    onMounted(async () => {
      try {
        const response = await createSession();
        sessionId.value = response.data.data.sessionId;
      } catch (error) {
        message.error('初始化聊天失败');
        console.error(error);
      }
    });
    
    // 发送消息并获取流式回复
    const sendMessage = async () => {
      if (!userInput.value.trim() || isStreaming.value) return;
      
      // 添加用户消息
      messages.value.push({
        role: 'user',
        content: userInput.value
      });
      
      const userMessage = userInput.value;
      userInput.value = '';
      isStreaming.value = true;
      streamingContent.value = '';
      
      // 使用方法1：Fetch API处理流式响应
      await useReadableStreamAPI(userMessage);
      
      // 或使用方法2：原生EventSource API（如果方法1不工作可尝试取消注释此行）
      // await useEventSourceAPI(userMessage);
    };
    
    // 方法1：使用Fetch API和ReadableStream
    const useReadableStreamAPI = async (userMessage) => {
      try {
        console.log('开始获取流式回复, 会话ID:', sessionId.value);
        
        // 使用API函数获取流式响应
        const response = await getStreamingResponse(userMessage, sessionId.value);
        
        if (!response.ok) {
          throw new Error(`流式响应错误: ${response.status} ${response.statusText}`);
        }
        
        console.log('开始读取流式响应');
        
        // 使用EventSource API处理SSE响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        
        // 流式读取数据
        let reading = true;
        while (reading) {
          const { value, done } = await reader.read();
          
          if (done) {
            console.log('流式响应读取完成');
            reading = false;
            continue;
          }
          
          // 解码并添加到当前流式内容
          try {
            const chunk = decoder.decode(value, { stream: true });
            console.log('接收到原始数据:', chunk);
            
            // 处理SSE格式 "data: [内容]\n\n"
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data:')) {
                // 提取data字段后的内容
                const content = line.substring(5).trim();
                if (content && content !== 'heartbeat') { // 忽略心跳消息
                  console.log('提取到消息内容:', content);
                  streamingContent.value += content;
                  await nextTick(); // 确保UI更新
                }
              }
            }
          } catch (decodeError) {
            console.error('解码错误:', decodeError);
          }
        }
        
        // 流式输出完成，添加到消息列表
        console.log('完整回复:', streamingContent.value);
        
        messages.value.push({
          role: 'assistant',
          content: streamingContent.value
        });
      } catch (error) {
        console.error('获取AI回复失败:', error);
        message.error('获取AI回复失败: ' + error.message);
        
        // 发生错误时，仍然添加一条错误消息
        messages.value.push({
          role: 'assistant',
          content: '抱歉，AI助手暂时无法回答您的问题，请稍后再试。'
        });
      } finally {
        isStreaming.value = false;
        streamingContent.value = '';
      }
    };
    
    // 方法2：使用原生EventSource API（更简单但不支持POST请求）
    // eslint-disable-next-line no-unused-vars
    const useEventSourceAPI = async (userMessage) => {
      try {
        console.log('使用EventSource API获取流式回复');
        
        // 注意：EventSource只支持GET请求，需要后端提供GET接口
        // 这里仅作为示例，实际应用中可能需要另外创建支持GET请求的端点
        const eventSource = new EventSource(`/api/ai-assistant/stream-sse?message=${encodeURIComponent(userMessage)}&sessionId=${sessionId.value}`);
        
        eventSource.onopen = () => {
          console.log('SSE连接已打开');
        };
        
        eventSource.onmessage = (event) => {
          console.log('收到SSE消息:', event.data);
          if (event.data && event.data !== 'heartbeat') {
            streamingContent.value += event.data;
          }
        };
        
        eventSource.onerror = (event) => {
          console.error('SSE错误:', event);
          eventSource.close();
          
          // 如果有内容，则添加到消息列表
          if (streamingContent.value) {
            messages.value.push({
              role: 'assistant',
              content: streamingContent.value
            });
          } else {
            messages.value.push({
              role: 'assistant',
              content: '抱歉，AI助手暂时无法回答您的问题，请稍后再试。'
            });
          }
          
          isStreaming.value = false;
          streamingContent.value = '';
        };
        
        // 监听自定义事件
        eventSource.addEventListener('complete', (event) => {
          console.log('流式输出完成', event.data);
          
          messages.value.push({
            role: 'assistant',
            content: streamingContent.value
          });
          
          eventSource.close();
          isStreaming.value = false;
          streamingContent.value = '';
        });
        
        // 等待响应完成
        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (!isStreaming.value) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        });
        
      } catch (error) {
        console.error('EventSource API错误:', error);
        message.error('获取AI回复失败: ' + error.message);
        
        messages.value.push({
          role: 'assistant',
          content: '抱歉，AI助手暂时无法回答您的问题，请稍后再试。'
        });
        
        isStreaming.value = false;
        streamingContent.value = '';
      }
    };
    
    // 格式化消息，将换行符转换为<br>标签
    const formatMessage = (content) => {
      if (!content) return '';
      return content.replace(/\n/g, '<br>');
    };
    
    return {
      messages,
      userInput,
      isStreaming,
      streamingContent,
      messagesContainer,
      sendMessage,
      formatMessage
    };
  }
});
</script>

<style scoped>
.streaming-chat-demo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  word-break: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #1890ff;
  color: white;
}

.ai-message {
  align-self: flex-start;
  background-color: white;
  border: 1px solid #e8e8e8;
}

.streaming {
  border-left: 3px solid #1890ff;
}

.message-content {
  line-height: 1.5;
}

.input-container {
  display: flex;
  padding: 16px;
  background-color: white;
  border-top: 1px solid #e8e8e8;
}

.input-container .ant-input {
  flex: 1;
  margin-right: 12px;
}

/* 打字指示器样式 */
.typing-indicator {
  display: flex;
  padding: 8px 0 0;
  justify-content: flex-start;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #1890ff;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  animation: bounce 1.3s linear infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}
</style> 