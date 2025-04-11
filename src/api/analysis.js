import { get, post } from './index'

// 上传视频进行分析
export function uploadVideo(data) {
  return post('/analysis/upload', data)
}

// 获取分析结果
export function getAnalysisResult(analysisId) {
  return get(`/analysis/result/${analysisId}`)
}

// 获取轨迹分析数据
export function getTrajectoryData(analysisId) {
  return get(`/analysis/trajectory/${analysisId}`)
}

// 获取动作分析数据
export function getActionData(analysisId) {
  return get(`/analysis/action/${analysisId}`)
}

// 保存分析结果
export function saveAnalysisResult(data) {
  return post('/analysis/save', data)
}

// 获取分析历史记录
export function getAnalysisHistory(params) {
  return get('/analysis/history', params)
}

// 获取动作类型列表
export function getActionTypes() {
  return get('/analysis/action-types')
}

// 获取动作评分标准
export function getActionScoreStandards() {
  return get('/analysis/score-standards')
} 