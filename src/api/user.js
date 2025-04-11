/*
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-19 15:29:13
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-23 16:26:21
 * @FilePath: \网页端\web_app\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post } from './index'

// 用户登录
export function login(data) {
  return post('/api/auth/login', data)
}

// 用户注册
export function register(data) {
  return post('/api/auth/register', data)
}

// 获取用户信息
export function getUserInfo() {
  return get('/api/user/info')
}

// 修改用户信息
export function updateUserInfo(data) {
  return post('/api/user/update', data)
}

// 修改密码
export function changePassword(data) {
  return post('/api/user/change-password', data)
}

// 获取用户列表
export function getUserList(params) {
  return get('/api/user/list', params)
}

// 获取用户训练记录
export function getUserTrainingRecords(userId, params) {
  return get(`/api/user/${userId}/training-records`, params)
}

// 获取用户训练统计数据
export function getUserTrainingStats(userId) {
  return get(`/api/user/${userId}/training-stats`)
} 