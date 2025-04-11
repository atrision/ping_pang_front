/*
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-28 20:10:00
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-28 20:10:00
 * @FilePath: \web_app\src\api\assistant.js
 * @Description: AI助手相关API
 */
import request from './index'

/**
 * 发送用户消息并获取AI回复
 * @param {String} message 用户消息内容
 * @param {String} sessionId 会话ID
 */
export function sendMessage(message, sessionId) {
  console.log('发送消息到AI助手API:', message, sessionId);
  
  return request({
    url: '/api/ai-assistant/send',
    method: 'post',
    data: {
      message,
      sessionId
    }
  }).then(response => {
    console.log('AI助手API原始响应:', response);
    return response;
  });
}

/**
 * 获取聊天历史记录
 * @param {String} sessionId 会话ID
 */
export function getChatHistory(sessionId) {
  console.log('获取聊天历史:', sessionId);
  
  return request({
    url: '/api/ai-assistant/history',
    method: 'get',
    params: {
      sessionId
    }
  }).then(response => {
    console.log('历史记录响应:', response);
    return response;
  });
}

/**
 * 创建新的聊天会话
 */
export function createSession() {
  console.log('创建新会话');
  
  return request({
    url: '/api/ai-assistant/session',
    method: 'post'
  }).then(response => {
    console.log('创建会话响应:', response);
    return response;
  });
}

/**
 * 获取用户的所有会话列表
 */
export function getSessionList() {
  return request({
    url: '/api/ai-assistant/sessions',
    method: 'get'
  }).then(response => {
    console.log('会话列表响应:', response);
    return response;
  });
}

/**
 * 删除指定会话
 * @param {String} sessionId 会话ID
 */
export function deleteSession(sessionId) {
  return request({
    url: `/api/ai-assistant/session/${sessionId}`,
    method: 'delete'
  }).then(response => {
    console.log('删除会话响应:', response);
    return response;
  });
}

/**
 * 获取流式AI回复（使用服务器发送事件SSE）
 * @param {String} message 用户消息内容
 * @param {String} sessionId 会话ID
 * @returns {Promise} 返回fetch请求的Promise对象
 */
export function getStreamingResponse(message, sessionId) {
  console.log('发送流式请求:', message, sessionId);
  
  return fetch(`/api/ai-assistant/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    },
    body: JSON.stringify({
      message,
      sessionId
    })
  }).then(response => {
    if (!response.ok) {
      console.error('流式响应返回错误状态码:', response.status);
    } else {
      console.log('流式响应成功, 状态码:', response.status, '内容类型:', response.headers.get('Content-Type'));
    }
    return response;
  }).catch(error => {
    console.error('流式请求发送失败:', error);
    throw error;
  });
} 