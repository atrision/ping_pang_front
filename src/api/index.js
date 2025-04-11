import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建axios实例
const service = axios.create({
  baseURL: '', // 不使用统一前缀，直接使用完整路径
  timeout: 150000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 打印请求信息
    console.log('发送请求:', config.method.toUpperCase(), config.url);
    console.log('请求参数:', config.method === 'get' ? config.params : config.data);
    
    // 计算并打印完整URL
    let fullUrl = config.baseURL;
    if (fullUrl && fullUrl.endsWith('/') && config.url.startsWith('/')) {
      fullUrl = fullUrl + config.url.substring(1);
    } else if (fullUrl && !fullUrl.endsWith('/') && !config.url.startsWith('/')) {
      fullUrl = fullUrl + '/' + config.url;
    } else {
      fullUrl = fullUrl + config.url;
    }
    console.log('完整URL:', fullUrl);
    
    // 在请求发送前添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据API设计修改判断条件
    // 后端返回code为0或200时表示请求成功
    if (res.code !== 0 && res.code !== 200) {
      message.error(res.message || '请求失败')
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        // 重定向到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    let errorMessage = error.message
    
    // 输出详细错误日志，便于调试
    console.error('API请求错误详情:', error)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      console.error('Response headers:', error.response.headers)
      
      switch (error.response.status) {
        case 401:
          errorMessage = '未授权，请登录'
          // 重定向到登录页
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = `请求失败: ${error.response.status}`
      }
    } else if (error.request) {
      console.error('Request error (no response):', error.request)
      errorMessage = '服务器未响应，请检查网络连接'
    } else {
      console.error('Error message:', error.message)
    }
    
    // 显示错误消息
    message.error(errorMessage)
    return Promise.reject(error)
  }
)

// 封装GET请求
export function get(url, params) {
  return service({
    url,
    method: 'get',
    params
  })
}

// 封装POST请求
export function post(url, data) {
  return service({
    url,
    method: 'post',
    data
  })
}

// 封装PUT请求
export function put(url, data) {
  return service({
    url,
    method: 'put',
    data
  })
}

// 封装DELETE请求
export function del(url, params) {
  return service({
    url,
    method: 'delete',
    params
  })
}

// 导出实例
export default service 