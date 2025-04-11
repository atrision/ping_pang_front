/*
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-28 20:12:00
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-28 20:12:00
 * @FilePath: \web_app\src\store\modules\assistant.js
 * @Description: AI助手状态管理
 */
import { defineStore } from 'pinia'
import { sendMessage, getChatHistory, createSession } from '@/api/assistant'

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    // 当前会话ID
    currentSessionId: null,
    // 消息历史记录 {id, content, timestamp, role}
    messages: [],
    // 是否正在加载
    loading: false,
    // 是否有错误
    error: null,
    // 会话列表
    sessions: []
  }),
  
  getters: {
    // 获取排序后的消息列表
    sortedMessages: (state) => {
      return [...state.messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    },
    
    // 检查是否有活跃会话
    hasActiveSession: (state) => !!state.currentSessionId,
    
    // 获取最新消息
    latestMessage: (state) => {
      if (state.messages.length === 0) return null
      return [...state.messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
    }
  },
  
  actions: {
    // 发送消息并获取回复
    async sendUserMessage(message) {
      try {
        this.loading = true;
        this.error = null;
        
        // 确保有会话ID
        if (!this.currentSessionId) {
          await this.createNewSession();
        }
        
        // 添加用户消息到本地状态
        const userMessage = {
          id: Date.now().toString(),
          content: message,
          timestamp: new Date().toISOString(),
          role: 'user'
        };
        this.messages.push(userMessage);
        
        // 发送消息到服务器
        const response = await sendMessage(message, this.currentSessionId);
        
        // 调试输出，查看API响应结构
        console.log('AI助手API响应:', response);
        
        if (response && response.data) {
          // 添加AI回复到本地状态 - 从response.data中获取AI回复信息
          this.messages.push({
            id: response.data.id || Date.now().toString() + '-ai',
            content: response.data.content,
            timestamp: response.data.timestamp || new Date().toISOString(),
            role: 'assistant'
          });
        } else {
          console.error('API响应格式不正确:', response);
          throw new Error('AI回复数据格式不正确');
        }
        
        return response;
      } catch (error) {
        this.error = error.message || '发送消息失败';
        console.error('发送消息失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取历史消息
    async loadChatHistory() {
      try {
        if (!this.currentSessionId) return
        
        this.loading = true
        this.error = null
        
        const history = await getChatHistory(this.currentSessionId)
        this.messages = history
        
        return history
      } catch (error) {
        this.error = error.message || '获取聊天记录失败'
        console.error('获取聊天记录失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建新会话
    async createNewSession() {
      try {
        this.loading = true
        this.error = null
        
        const response = await createSession()
        console.log('创建会话响应:', response);
        
        if (response && response.data) {
          this.currentSessionId = response.data.sessionId;
        } else {
          this.currentSessionId = 'default-session-' + Date.now();
          console.warn('使用临时会话ID:', this.currentSessionId);
        }
        
        this.messages = []
        
        return response
      } catch (error) {
        this.error = error.message || '创建会话失败'
        console.error('创建会话失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 清空当前会话消息
    clearMessages() {
      this.messages = []
    },
    
    // 设置当前会话ID
    setCurrentSession(sessionId) {
      this.currentSessionId = sessionId
      this.clearMessages()
      if (sessionId) {
        this.loadChatHistory()
      }
    }
  }
}) 