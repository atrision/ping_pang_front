/*
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-04-09 15:02:14
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-04-10 17:50:23
 * @FilePath: \网页端\web_app\src\api\report.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post } from './index'

// 生成训练报告
export function generateReport(data) {
  return post('/report/generate', data)
}

// 获取报告详情
export function getReportDetail(reportId) {
  return get(`/report/detail/${reportId}`)
}

// 获取报告列表
export function getReportList(params) {
  return get('/report/list', params)
}

// 获取报告模板列表
export function getReportTemplates() {
  return get('/report/templates')
}

// 保存报告
export function saveReport(data) {
  return post('/api/report/save', data)
}

// 导出报告为PDF
export function exportReportPDF(reportId) {
  return fetch(`/api/report/export/pdf/${reportId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/pdf',
    },
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`导出PDF失败: ${response.status} ${response.statusText}\n${text}`);
      });
    }
    
    // 检查内容类型
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      // 如果是JSON，说明返回了错误信息
      return response.json().then(json => {
        throw new Error(`服务器返回了JSON而不是PDF: ${JSON.stringify(json)}`);
      });
    }
    
    return response.blob();
  });
}

// 获取报告推荐建议
export function getReportSuggestions(data) {
  return post('/report/suggestions', data)
}

// 获取大模型分析结果
export const getModelAnalysis = async (requestData) => {
  try {
    // 将超时时间从15秒增加到150秒
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 150000);
    
    const response = await fetch('/api/report/model-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('后端响应原始数据:', result); // 调试日志
    
    // 确保返回标准化后的数据
    return result;
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
} 