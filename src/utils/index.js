/**
 * 格式化日期时间
 * @param {Date|string|number} date 日期对象/字符串/时间戳
 * @param {string} format 格式化模式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  date = new Date(date)
  
  const formatObj = {
    YYYY: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0')
  }
  
  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, match => formatObj[match])
}

/**
 * 格式化文件大小
 * @param {number} size 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(size) {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj 要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  if (obj instanceof Object) {
    const copy = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepClone(obj[key])
      }
    }
    return copy
  }
  
  return obj
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间(ms)
 * @returns {Function} 包装后的函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  
  return function(...args) {
    if (timer) clearTimeout(timer)
    
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} limit 时间限制(ms)
 * @returns {Function} 包装后的函数
 */
export function throttle(fn, limit = 300) {
  let inThrottle = false
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
export function randomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 检查对象是否为空
 * @param {Object} obj 要检查的对象
 * @returns {boolean} 是否为空
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

/**
 * 获取URL参数
 * @param {string} name 参数名
 * @param {string} url URL，默认为当前URL
 * @returns {string|null} 参数值
 */
export function getUrlParam(name, url = window.location.href) {
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  
  if (!results) return null
  if (!results[2]) return ''
  
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * 判断设备类型
 * @returns {Object} 设备类型信息
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent
  const isAndroid = /Android/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isWechat = /MicroMessenger/i.test(ua)
  const isDesktop = !isAndroid && !isIOS
  
  return {
    isAndroid,
    isIOS,
    isWechat,
    isDesktop,
    isMobile: isAndroid || isIOS
  }
} 