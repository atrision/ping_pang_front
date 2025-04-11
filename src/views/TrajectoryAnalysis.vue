<template>
  <div class="trajectory-analysis">
    <a-row :gutter="16">
      <a-col :xs="24" :md="24" :lg="24">
        <a-card title="乒乓球轨迹及动作分析" :bordered="false">
          <p>通过上传乒乓球比赛或训练视频，分析球的轨迹和运动员的动作，提供专业技术评估。</p>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :xs="24" :lg="24">
        <a-card :bordered="false">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="upload" tab="上传视频">
              <div class="upload-area">
                <a-upload-dragger
                  v-model:fileList="fileList"
                  name="file"
                  :multiple="false"
                  :customRequest="customUpload"
                  @change="handleChange"
                  :showUploadList="false"
                >
                  <p class="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p class="ant-upload-hint">
                    支持单个视频文件上传，格式限制：MP4, AVI, MOV，大小不超过500MB
                  </p>
                </a-upload-dragger>
                <div v-if="fileList.length > 0" class="upload-list">
                  <a-list :dataSource="fileList" :bordered="false">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta
                          :title="item.name"
                          :description="formatFileSize(item.size)"
                        >
                          <template #avatar>
                            <VideoCameraOutlined />
                          </template>
                        </a-list-item-meta>
                        <template #actions>
                          <a-button 
                            type="primary" 
                            :loading="uploading" 
                            @click="handleUpload"
                            v-if="!item.status || item.status === 'error'"
                          >
                            上传
                          </a-button>
                          <a-button 
                            danger 
                            @click="handleRemove(item)"
                            v-if="!uploading"
                          >
                            移除
                          </a-button>
                        </template>
                        <a-progress 
                          v-if="item.status === 'uploading'" 
                          :percent="item.percent || 0" 
                        />
                      </a-list-item>
                    </template>
                  </a-list>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="analysis" tab="分析结果" :disabled="!hasAnalysisResult">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-card title="原始视频" :bordered="false">
                    <div class="video-player">
                      <video 
                        ref="videoPlayer" 
                        controls 
                        width="100%"
                        @error="handleVideoError"
                        @loadstart="handleVideoLoading"
                      >
                        <source :src="videoUrl" type="video/mp4" v-if="videoUrl">
                        您的浏览器不支持视频播放
                      </video>
                    </div>
                  </a-card>
                </a-col>
                <a-col :span="12">
                  <a-card title="轨迹可视化" :bordered="false">
                    <div class="trajectory-visualization">
                      <div class="canvas-container" ref="canvasContainer">
                        <canvas ref="trajectoryCanvas" width="640" height="360"></canvas>
                      </div>
                      <div class="visualization-controls">
                        <a-slider 
                          v-model:value="currentFrame" 
                          :min="0" 
                          :max="totalFrames" 
                          :disabled="!hasAnalysisResult"
                          @change="onSliderChange"
                        />
                        <div class="time-display">
                          {{ formatTime(currentFrameTime) }} / {{ formatTime(totalDuration) }}
                        </div>
                      </div>
                    </div>
                  </a-card>
                </a-col>
              </a-row>

              <a-row :gutter="16" style="margin-top: 20px">
                <a-col :span="24">
                  <a-card title="动作分析结果" :bordered="false">
                    <a-descriptions bordered :column="{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }">
                      <a-descriptions-item label="动作类型">
                        正手攻球
                      </a-descriptions-item>
                      <a-descriptions-item label="击球速度">
                        35 km/h
                      </a-descriptions-item>
                      <a-descriptions-item label="旋转类型">
                        上旋
                      </a-descriptions-item>
                      <a-descriptions-item label="旋转强度">
                        中等
                      </a-descriptions-item>
                      <a-descriptions-item label="动作规范度" :span="2">
                        <a-progress :percent="85" status="active" />
                      </a-descriptions-item>
                      <a-descriptions-item label="姿势稳定性" :span="2">
                        <a-progress :percent="78" status="active" />
                      </a-descriptions-item>
                    </a-descriptions>
                    
                    <a-divider />
                    
                    <a-timeline>
                      <a-timeline-item color="green">
                        <h4>0:05 - 正手攻球</h4>
                        <p>动作规范，击球点位置恰当，球速适中。</p>
                      </a-timeline-item>
                      <a-timeline-item color="blue">
                        <h4>0:12 - 侧身攻球</h4>
                        <p>步法移动稍慢，但击球姿势较为标准。</p>
                      </a-timeline-item>
                      <a-timeline-item color="red">
                        <h4>0:20 - 反手拉球</h4>
                        <p>手臂角度不够，导致球速较慢，建议调整握拍角度。</p>
                      </a-timeline-item>
                      <a-timeline-item color="green">
                        <h4>0:27 - 正手攻球</h4>
                        <p>发力充分，击球质量高。</p>
                      </a-timeline-item>
                    </a-timeline>
                    
                    <a-divider />
                    
                    <div class="action-buttons">
                      <a-button type="primary" @click="saveTechnicalAnalysis">
                        保存分析结果
                      </a-button>
                      <a-button style="margin-left: 8px" @click="generateReport">
                        生成详细报告
                      </a-button>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { InboxOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'
import { formatFileSize } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeKey = ref('upload')
const fileList = ref([])
const uploading = ref(false)
const hasAnalysisResult = ref(false)
const videoUrl = ref('')
const videoPlayer = ref(null)
const trajectoryCanvas = ref(null)
const canvasContainer = ref(null)
const currentFrame = ref(0)
const totalFrames = ref(100)
const currentFrameTime = ref(0)
const totalDuration = ref(30)
const videoLoading = ref(false)

// 后端上传地址
const uploadUrl = ref('http://localhost:8080/api/videos/upload')

const formatTime = (seconds) => {
  const date = new Date(seconds * 1000);
  return date.toISOString().substr(11, 8); // 格式化为HH:mm:ss
};

// 自定义上传处理
const customUpload = async ({ file, onSuccess, onError }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', 9) // 根据实际情况获取用户ID
    formData.append('title', file.name)
    formData.append('description', '视频分析描述') // 添加必填的description字段

    const response = await fetch(uploadUrl.value, {
      method: 'POST',
      // 对于FormData，不要手动设置Content-Type，让浏览器自动设置multipart/form-data和boundary
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`上传失败: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    
    // 返回标准结构
    onSuccess({
      ...responseData,
      fileUrl: responseData.fileUrl || responseData.url || responseData.path
    }, file)
    
    // 处理上传成功后的逻辑
    processUploadSuccess()
    
  } catch (error) {
    console.error('上传错误:', error)
    message.error('上传失败: ' + error.message)
    onError({
      message: error.message,
      stack: error.stack
    })
  }
}

// 处理文件变更
const handleChange = (info) => {
  fileList.value = info.fileList
    .map(file => ({
      ...file,
      status: file.status || 'ready',
      originFileObj: file.originFileObj || file
    }))
    .slice(-1) // 保持单文件上传
}

// 移除文件
const handleRemove = (file) => {
  fileList.value = fileList.value.filter(item => item.uid !== file.uid)
}

// 处理上传成功后的逻辑
const processUploadSuccess = () => {
  try {
    videoUrl.value = getValidVideoSource()
    hasAnalysisResult.value = true
    activeKey.value = 'analysis'
    message.success('视频上传成功，开始分析...')

    setTimeout(() => {
      message.success('分析完成！')
      initCanvas()
      if (videoPlayer.value) {
        videoPlayer.value.onloadedmetadata = () => {
          totalDuration.value = videoPlayer.value.duration
        }
      }
    }, 2000)
  } catch (error) {
    message.error(error.message)
  }
}

// 获取有效的视频源
const getValidVideoSource = () => {
  if (!fileList.value.length) {
    throw new Error('没有可用的视频文件')
  }

  const file = fileList.value[0]
  
  // 优先使用后端返回的URL
  if (file.response?.fileUrl) {
    return file.response.fileUrl
  }

  // 检查本地文件对象
  if (file.originFileObj instanceof File) {
    try {
      return URL.createObjectURL(file.originFileObj)
    } catch (error) {
      throw new Error('生成预览链接失败: ' + error.message)
    }
  }

  throw new Error('无效的视频文件格式')
}

// 视频错误处理
const handleVideoError = () => {
  message.error('视频加载失败，请检查文件格式')
  videoUrl.value = ''
}

// 视频加载状态处理
// const handleVideoLoading = () => {
//   videoLoading.value = true
//   message.loading('视频加载中...', 0)
// }

// 更新元数据事件处理
const updateVideoProgress = () => {
  if (videoPlayer.value) {
    videoPlayer.value.ontimeupdate = () => {
      currentFrameTime.value = videoPlayer.value.currentTime
      const frameIndex = Math.floor((videoPlayer.value.currentTime / totalDuration.value) * totalFrames.value)
      currentFrame.value = frameIndex
      drawFrame(frameIndex)
    }
  }
}

// 视频进度条改变
const onSliderChange = (value) => {
  currentFrame.value = value
  if (videoPlayer.value) {
    const seekTime = (value / totalFrames.value) * totalDuration.value
    videoPlayer.value.currentTime = seekTime
    currentFrameTime.value = seekTime
    drawFrame(value)
  }
}

// 绘制轨迹
const drawFrame = (frameIndex) => {
  if (!trajectoryCanvas.value) return
  
  const ctx = trajectoryCanvas.value.getContext('2d')
  ctx.clearRect(0, 0, trajectoryCanvas.value.width, trajectoryCanvas.value.height)
  
  // 绘制球场背景
  ctx.fillStyle = '#4CAF50'
  ctx.fillRect(0, 0, trajectoryCanvas.value.width, trajectoryCanvas.value.height)
  
  // 绘制球桌
  ctx.fillStyle = '#2196F3'
  const tableWidth = trajectoryCanvas.value.width * 0.8
  const tableHeight = tableWidth / 2
  const tableX = (trajectoryCanvas.value.width - tableWidth) / 2
  const tableY = (trajectoryCanvas.value.height - tableHeight) / 2
  ctx.fillRect(tableX, tableY, tableWidth, tableHeight)
  
  // 绘制球网
  ctx.fillStyle = 'white'
  ctx.fillRect(trajectoryCanvas.value.width / 2 - 2, tableY, 4, tableHeight)
  
  // 绘制球的轨迹
  // 这里是模拟数据，实际应该根据分析结果绘制
  const maxFrames = 100
  const trajectoryPoints = []
  
  for (let i = 0; i < maxFrames; i++) {
    // 模拟一条抛物线轨迹
    const x = tableX + (i / maxFrames) * tableWidth
    const y = tableY + tableHeight / 2 - 50 * Math.sin((i / maxFrames) * Math.PI)
    trajectoryPoints.push({ x, y })
  }
  
  // 绘制完整轨迹（透明）
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 2
  trajectoryPoints.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.stroke()
  
  // 绘制当前帧之前的轨迹（实线）
  if (frameIndex > 0) {
    ctx.beginPath()
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    for (let i = 0; i <= frameIndex && i < trajectoryPoints.length; i++) {
      if (i === 0) {
        ctx.moveTo(trajectoryPoints[i].x, trajectoryPoints[i].y)
      } else {
        ctx.lineTo(trajectoryPoints[i].x, trajectoryPoints[i].y)
      }
    }
    ctx.stroke()
    
    // 绘制当前球的位置
    if (frameIndex < trajectoryPoints.length) {
      const currentPoint = trajectoryPoints[frameIndex]
      ctx.beginPath()
      ctx.fillStyle = 'orange'
      ctx.arc(currentPoint.x, currentPoint.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
  
  // 绘制运动员骨骼（模拟数据）
  const player1X = tableX - 50
  const player2X = tableX + tableWidth + 50
  const playerY = tableY + tableHeight / 2
  
  // 玩家1
  drawPlayer(ctx, player1X, playerY, frameIndex, 'left')
  
  // 玩家2
  drawPlayer(ctx, player2X, playerY, frameIndex, 'right')
}

// 绘制运动员骨骼
const drawPlayer = (ctx, x, y, frameIndex, direction) => {
  // 简单模拟运动员的骨骼姿势
  const headRadius = 10
  const bodyLength = 40
  const armLength = 30
  const legLength = 35
  
  // 根据帧索引计算动作角度
  const armAngle = Math.sin(frameIndex * 0.1) * 0.3 + (direction === 'left' ? -0.5 : 0.5)
  const legAngle = Math.sin(frameIndex * 0.1) * 0.2
  
  // 头部
  ctx.beginPath()
  ctx.fillStyle = 'white'
  ctx.arc(x, y - bodyLength - headRadius, headRadius, 0, 2 * Math.PI)
  ctx.fill()
  
  // 躯干
  ctx.beginPath()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  ctx.moveTo(x, y - bodyLength)
  ctx.lineTo(x, y)
  ctx.stroke()
  
  // 手臂
  ctx.beginPath()
  ctx.moveTo(x, y - bodyLength + 10)
  
  // 左手/右手（取决于方向）
  const armEndX = x + Math.cos(armAngle) * armLength * (direction === 'left' ? -1 : 1)
  const armEndY = y - bodyLength + 10 + Math.sin(armAngle) * armLength
  ctx.lineTo(armEndX, armEndY)
  
  // 拍子
  const racketLength = 15
  const racketEndX = armEndX + Math.cos(armAngle) * racketLength * (direction === 'left' ? -1 : 1)
  const racketEndY = armEndY + Math.sin(armAngle) * racketLength
  ctx.lineTo(racketEndX, racketEndY)
  ctx.stroke()
  
  // 另一只手臂
  ctx.beginPath()
  ctx.moveTo(x, y - bodyLength + 10)
  const otherArmAngle = -armAngle * 0.5
  const otherArmEndX = x + Math.cos(otherArmAngle) * (armLength * 0.8) * (direction === 'left' ? -1 : 1)
  const otherArmEndY = y - bodyLength + 10 + Math.sin(otherArmAngle) * (armLength * 0.8)
  ctx.lineTo(otherArmEndX, otherArmEndY)
  ctx.stroke()
  
  // 双腿
  ctx.beginPath()
  ctx.moveTo(x, y)
  const leg1EndX = x + Math.cos(legAngle) * legLength * 0.7 * (direction === 'left' ? -1 : 1)
  const leg1EndY = y + Math.sin(legAngle) * legLength
  ctx.lineTo(leg1EndX, leg1EndY)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(x, y)
  const leg2EndX = x + Math.cos(-legAngle) * legLength * 0.7 * (direction === 'left' ? -1 : 1)
  const leg2EndY = y + Math.sin(-legAngle) * legLength
  ctx.lineTo(leg2EndX, leg2EndY)
  ctx.stroke()
}

// 初始化画布
const initCanvas = () => {
  if (canvasContainer.value && trajectoryCanvas.value) {
    // 调整画布大小以适应容器
    trajectoryCanvas.value.width = canvasContainer.value.clientWidth
    trajectoryCanvas.value.height = canvasContainer.value.clientWidth * 9 / 16 // 16:9 比例
    
    drawFrame(0)
  }
}

// 保存分析结果
const saveTechnicalAnalysis = () => {
  message.success('分析结果已保存！')
}

// 生成详细报告
const generateReport = () => {
  message.success('正在生成详细报告...')
  setTimeout(() => {
    router.push('/training-report')
  }, 1000)
}

// 处理文件上传（实现缺失的handleUpload方法）
const handleUpload = async () => {
  if (fileList.value.length === 0) {
    message.warning('请先选择要上传的视频文件')
    return
  }
  
  const file = fileList.value[0]
  
  // 如果文件已经上传成功，直接切换到分析页面
  if (file.status === 'done') {
    activeKey.value = 'analysis'
    return
  }
  
  uploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file.originFileObj)
    formData.append('userId', 9) // 根据实际情况获取用户ID
    formData.append('title', file.name)
    formData.append('description', '视频分析描述') // 添加必填的description字段
    
    const response = await fetch(uploadUrl.value, {
      method: 'POST',
      // 对于FormData，不要手动设置Content-Type，让浏览器自动设置multipart/form-data和boundary
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`上传失败: ${response.status} ${response.statusText}`)
    }
    
    const responseData = await response.json()
    
    // 更新文件状态
    file.status = 'done'
    file.response = {
      ...responseData,
      fileUrl: responseData.fileUrl || responseData.url || responseData.path
    }
    
    // 处理上传成功后的逻辑
    processUploadSuccess()
    
  } catch (error) {
    console.error('上传错误:', error)
    message.error('上传失败: ' + error.message)
    
    // 更新文件状态为错误
    const file = fileList.value[0]
    file.status = 'error'
    file.error = error.message
    
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  // 响应窗口大小变化
  window.addEventListener('resize', initCanvas)
  
  // 视频加载后更新进度
  if (videoPlayer.value) {
    videoPlayer.value.onloadedmetadata = () => {
      videoLoading.value = false
      message.destroy()
      updateVideoProgress()
      totalDuration.value = videoPlayer.value.duration
    }
  }
})
</script>

<style scoped>
.trajectory-analysis {
  padding: 16px;
}

.upload-area {
  margin-top: 16px;
}

.upload-list {
  margin-top: 16px;
}

.video-player {
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.trajectory-visualization {
  border: 1px solid #f0f0f0;
  padding: 16px;
}

.canvas-container {
  background: #f0f0f0;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visualization-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-display {
  text-align: center;
  font-family: monospace;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-buttons button {
    margin-left: 0 !important;
  }
}

/* 确保上传区域可点击 */
.upload-area .ant-upload.ant-upload-drag {
  cursor: pointer;
}

/* 按钮状态样式 */
.upload-list .ant-btn[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>