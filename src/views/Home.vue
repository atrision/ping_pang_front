<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <a-row class="top-search-bar" :gutter="[24, 0]">
      <a-col :xs="24" :md="8" :lg="8">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="乒乓球分析系统" class="logo" />
          <span class="logo-text">乒乓球分析系统</span>
        </div>
      </a-col>
      <a-col :xs="24" :md="16" :lg="16" class="top-right-tools">
        <a-input-search placeholder="搜索训练记录..." class="search-box" />
        <a-button type="link" class="top-icon-btn">
          <template #icon><QuestionCircleOutlined /></template>
          帮助中心
        </a-button>
        <a-button type="link" class="top-icon-btn">
          <template #icon><SettingOutlined /></template>
          设置
        </a-button>
      </a-col>
    </a-row>

    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :md="24" :lg="24">
        <a-card class="welcome-card" :bordered="false">
          <template #cover>
            <div class="welcome-banner">
              <h1>欢迎使用乒乓球运动分析系统</h1>
              <p>基于百度飞桨PaddlePaddle深度学习平台和百度千帆文心大模型的智能乒乓球分析系统</p>
              <a-button type="primary" size="large" class="quick-start-btn">
                <template #icon><ThunderboltOutlined /></template>
                快速入门指南
              </a-button>
            </div>
          </template>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[24, 24]" class="section-container">
      <a-col :xs="24" :md="24" :lg="24">
        <div class="section-header">
          <i class="core-feature-icon"></i>
          <h2>核心功能</h2>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6" v-for="(feature, index) in features" :key="index">
        <div class="feature-card" @click="navigateTo(feature.route)">
          <div class="icon-container">
            <template v-if="feature.svgIcon">
              <svg width="80" height="80" class="feature-svg">
                <template v-if="index === 0">
                  <!-- 乒乓球轨迹分析 - 半圆弧和运动轨迹线条 -->
                  <path d="M10 70 L70 10" stroke="#4a86e8" strokeWidth="3" />
                  <circle cx="40" cy="40" r="30" stroke="#4a86e8" fill="none" />
                </template>
                <template v-else-if="index === 1">
                  <!-- 训练数据可视化 - 柱状图/饼图组合 -->
                  <rect x="15" y="50" width="15" height="25" fill="#4a86e8" />
                  <rect x="35" y="35" width="15" height="40" fill="#4a86e8" />
                  <rect x="55" y="20" width="15" height="55" fill="#4a86e8" opacity="0.7" />
                </template>
                <template v-else-if="index === 2">
                  <!-- 用户数据管理 - 数据库表单用户档案 -->
                  <rect x="10" y="15" width="60" height="50" rx="2" fill="#f3f3f3" stroke="#4a86e8" strokeWidth="2" />
                  <path d="M10 25 L70 25" stroke="#4a86e8" strokeWidth="2" />
                  <circle cx="40" cy="10" r="8" fill="#4a86e8" />
                  <path d="M30 10 L50 10" stroke="#fff" strokeWidth="2" />
                  <path d="M40 5 L40 15" stroke="#fff" strokeWidth="2" />
                  <line x1="20" y1="35" x2="60" y2="35" stroke="#4a86e8" strokeWidth="1" strokeDasharray="2" />
                  <line x1="20" y1="45" x2="60" y2="45" stroke="#4a86e8" strokeWidth="1" strokeDasharray="2" />
                  <line x1="20" y1="55" x2="60" y2="55" stroke="#4a86e8" strokeWidth="1" strokeDasharray="2" />
                </template>
                <template v-else-if="index === 3">
                  <!-- 训练报告生成 - 文件+生成解决 -->
                  <rect x="15" y="10" width="50" height="60" fill="#f3f3f3" stroke="#4a86e8" strokeWidth="2" rx="3" />
                  <path d="M25 20 L55 20" stroke="#4a86e8" strokeWidth="2" />
                  <path d="M25 30 L55 30" stroke="#4a86e8" strokeWidth="2" />
                  <path d="M25 40 L45 40" stroke="#4a86e8" strokeWidth="2" />
                  <path d="M25 50 L55 50" stroke="#4a86e8" strokeWidth="2" opacity="0.7" />
                  <path d="M25 60 L40 60" stroke="#4a86e8" strokeWidth="2" opacity="0.5" />
                </template>
              </svg>
            </template>
          </div>
          <div class="feature-content">
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <a-button type="primary" block @click.stop="navigateTo(feature.route)" class="feature-btn">
              进入功能
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
    
    <a-row :gutter="[24, 24]" class="section-container">
      <a-col :span="24">
        <div class="section-header">
          <BarChartOutlined class="section-icon" />
          <h2>数据概览</h2>
          
          <!-- 显示当前时间范围 -->
          <div class="current-range">
            <a-tag color="blue">
              {{ getTimeRangeText(timeRange) }}
            </a-tag>
          </div>
          
          <!-- 时间筛选器 -->
          <div class="time-filter">
            <a-select v-model="timeRange" style="width: 120px" @change="handleTimeRangeChange">
              <a-select-option value="today">今日</a-select-option>
              <a-select-option value="week">本周</a-select-option>
              <a-select-option value="month">本月</a-select-option>
            </a-select>
          </div>
        </div>
        
        <a-card :bordered="false" :loading="loading" class="data-overview-card">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="12" :lg="6" class="data-stat-col" v-for="(stat, index) in dataStats" :key="index">
              <a-tooltip :title="stat.tooltip" placement="top">
                <div class="data-metric-card">
                  <div class="metric-header">
                    <component :is="stat.icon" class="stat-icon" />
                    <h3 class="metric-title">{{ stat.title }}</h3>
                  </div>
                  
                  <div class="metric-value-container">
                    <span class="metric-value">{{ stat.value }}</span>
                    <span class="metric-unit">{{ stat.suffix }}</span>
                    
                    <div class="metric-comparison" v-if="stat.comparison">
                      <a-tag :color="getComparisonColor(stat.comparison.trend)">
                        {{ stat.comparison.trend === 'up' ? '↑' : '↓' }} {{ stat.comparison.value }}
                      </a-tag>
                      <span class="comparison-label">{{ stat.comparison.label }}</span>
                    </div>
                  </div>
                  
                  <!-- 进度条 -->
                  <div class="progress-container" v-if="stat.progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: `${stat.progress.value}%`, backgroundColor: stat.progress.color || '#4a86e8' }"></div>
                    </div>
                    <div class="progress-labels">
                      <span>当前</span>
                      <span>{{ stat.progress.target }}</span>
                    </div>
                  </div>
                </div>
              </a-tooltip>
            </a-col>
          </a-row>

          <a-row :gutter="[24, 24]" class="chart-row">
            <a-col :xs="24" :lg="14">
              <a-card :bordered="false" title="训练评分趋势">
                <div ref="trainingChart" class="chart-container"></div>
              </a-card>
            </a-col>
            <a-col :xs="24" :lg="10">
              <a-card class="recent-activities" :bordered="false">
                <template #title>
                  <div class="activity-header">
                    <HistoryOutlined />
                    <span class="section-title">最近训练记录</span>
                    
                    <!-- 导出按钮 -->
                    <a-tooltip title="导出训练数据">
                      <a-button type="link" size="small" class="export-btn" @click="handleExportData">
                        <DownloadOutlined /> 导出
                      </a-button>
                    </a-tooltip>
                  </div>
                </template>
                <a-list 
                  itemLayout="horizontal" 
                  :dataSource="recentActivities"
                >
                  <template #renderItem="{ item }">
                    <a-list-item class="activity-item">
                      <a-list-item-meta
                        :title="item.title"
                        :description="item.time"
                      >
                        <template #avatar>
                          <a-avatar :icon="item.icon" class="activity-avatar" :style="{ background: item.avatarColor || '#1890ff' }" />
                        </template>
                      </a-list-item-meta>
                      <div class="activity-detail">
                        <div class="activity-score" :class="getScoreClass(item.score)">{{ item.score }}分</div>
                        <div class="activity-metrics" v-if="item.metrics">
                          <a-tag v-for="(metric, i) in item.metrics" :key="i" :color="metric.color">
                            {{ metric.label }}: {{ metric.value }}
                          </a-tag>
                        </div>
                      </div>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <!-- AI助手悬浮按钮 -->
    <div class="ai-assistant-floating">
      <a-button type="primary" shape="circle" size="large" @click="navigateToAIAssistant">
        <template #icon><RobotOutlined /></template>
      </a-button>
      <span class="assistant-tooltip">AI助手</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { 
  BarChartOutlined, 
  VideoCameraOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  RobotOutlined,
  HistoryOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  FireOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const trainingChart = ref(null)
const loading = ref(true)
const timeRange = ref('today') // 默认显示今日数据

// 功能列表
const features = [
  {
    title: '乒乓球轨迹分析',
    description: '智能分析运动视频，提供专业动作评估及优化建议。',
    svgIcon: true,
    route: '/trajectory-analysis'
  },
  {
    title: '训练数据可视化',
    description: '多维度图表展示，训练成果一目了然，助力快速进步。',
    svgIcon: true,
    route: '/training-visualization'
  },
  {
    title: '用户数据管理',
    description: '专业管理训练档案，个性化数据分析助力提升。',
    svgIcon: true,
    route: '/user-management'
  },
  {
    title: '训练报告生成',
    description: 'AI智能生成个性化训练方案，提供专家级技术指导。',
    svgIcon: true,
    route: '/training-report'
  }
]

// 获取时间范围显示文本
const getTimeRangeText = (range) => {
  switch(range) {
    case 'today': return '今日数据';
    case 'week': return '本周数据';
    case 'month': return '本月数据';
    default: return '今日数据';
  }
}

// 时间筛选函数
const handleTimeRangeChange = (value) => {
  // 根据选择的时间范围更新数据
  console.log('时间范围改变为:', value)
  // 这里可以添加实际的数据刷新逻辑
  refreshData(value)
}

// 刷新数据函数
const refreshData = (timeRange) => {
  console.log('刷新数据，当前时间范围:', timeRange);
  loading.value = true;
  
  // 模拟数据加载延迟
  setTimeout(() => {
    try {
      // 更新指标数据
      // 实际项目中，这里应该调用API获取对应时间范围的数据
      if (timeRange === 'today') {
        // 今日数据已在dataStats中设置
        console.log('加载今日数据完成');
      } else if (timeRange === 'week') {
        // 本周数据示例
        console.log('加载本周数据完成');
        // 这里可以根据需要更新dataStats数据
      } else {
        // 本月数据示例
        console.log('加载本月数据完成');
        // 这里可以根据需要更新dataStats数据
      }
      
      // 确保DOM已更新
      nextTick(() => {
        // 检查图表容器是否存在并有尺寸
        if (trainingChart.value && 
            trainingChart.value.offsetWidth && 
            trainingChart.value.offsetHeight) {
          console.log('开始初始化图表, 容器尺寸:', 
                      trainingChart.value.offsetWidth, 
                      'x', 
                      trainingChart.value.offsetHeight);
          initChart();
        } else {
          console.error('图表容器不存在或尺寸为0');
          // 增加延迟再次尝试初始化
          setTimeout(() => {
            if (trainingChart.value) {
              console.log('延迟后再次尝试初始化图表');
              initChart();
            }
          }, 500);
        }
      });
    } catch (error) {
      console.error('刷新数据出错:', error);
    } finally {
      loading.value = false;
    }
  }, 500);
}

// 导出数据函数
const handleExportData = () => {
  console.log('导出训练数据')
  // 导出数据逻辑
  // 实际项目中，这里应该调用后端API生成并下载数据报表
}

// 获取比较标签的颜色
const getComparisonColor = (trend) => {
  return trend === 'up' ? '#52c41a' : '#f5222d'
}

// 数据统计
const dataStats = [
  { 
    title: '今日训练次数', 
    value: 28, 
    icon: FireOutlined,
    suffix: '次',
    tooltip: '今日完成的所有训练活动总次数',
    comparison: {
      trend: 'up',
      value: '15%',
      label: 'vs 昨日'
    }
  },
  { 
    title: '动作识别准确率', 
    value: 92, 
    icon: TrophyOutlined,
    suffix: '%',
    tooltip: '系统识别动作的准确率，包含正手击球/反手接发球等各类动作的识别',
    progress: {
      value: 92,
      target: '目标: 95%',
      color: '#52c41a'
    }
  },
  { 
    title: '本周累计训练', 
    value: 47, 
    icon: ClockCircleOutlined,
    suffix: '小时',
    tooltip: '本周累计训练时长，包含所有训练类型'
  },
  { 
    title: '报告生成量', 
    value: 12, 
    icon: RocketOutlined,
    suffix: '份',
    tooltip: '系统生成的训练评估报告数量',
    comparison: {
      trend: 'up',
      value: '4份',
      label: '本周累计'
    }
  }
]

// 最近训练记录增强
const recentActivities = ref([
  { 
    title: '正手攻球训练', 
    time: '2023-06-10 10:30', 
    score: 85, 
    icon: VideoCameraOutlined, 
    avatarColor: '#1890ff',
    metrics: [
      { label: '击球力量', value: '86%', color: 'blue' },
      { label: '准确率', value: '92%', color: 'green' }
    ]
  },
  { 
    title: '反手拉球训练', 
    time: '2023-06-08 14:20', 
    score: 78, 
    icon: VideoCameraOutlined, 
    avatarColor: '#52c41a',
    metrics: [
      { label: '稳定性', value: '75%', color: 'orange' },
      { label: '速度', value: '82%', color: 'blue' }
    ]
  },
  { 
    title: '发球技术训练', 
    time: '2023-06-05 16:45', 
    score: 90, 
    icon: VideoCameraOutlined, 
    avatarColor: '#722ed1',
    metrics: [
      { label: '旋转', value: '95%', color: 'green' },
      { label: '落点', value: '88%', color: 'blue' }
    ]
  },
  { 
    title: '步法移动训练', 
    time: '2023-06-02 09:15', 
    score: 82, 
    icon: VideoCameraOutlined, 
    avatarColor: '#fa8c16',
    metrics: [
      { label: '速度', value: '87%', color: 'blue' },
      { label: '灵活性', value: '80%', color: 'orange' }
    ]
  }
])

// 获取评分颜色类
const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-average'
  return 'score-poor'
}

// 页面跳转
const navigateTo = (path) => {
  router.push(path)
}

// AI助手页面跳转
const navigateToAIAssistant = () => {
  router.push('/ai-assistant')
}

// 初始化图表
const initChart = (retryCount = 0) => {
  const maxRetries = 5;
  
  if (!trainingChart.value) {
    console.error('图表容器引用不存在');
    return;
  }
  
  if (!trainingChart.value.offsetWidth || !trainingChart.value.offsetHeight) {
    if (retryCount < maxRetries) {
      console.log(`图表容器尺寸不足，${retryCount+1}/${maxRetries}次重试`);
      setTimeout(() => initChart(retryCount + 1), 300);
    } else {
      console.error('图表容器尺寸检查失败，已达最大重试次数');
    }
    return;
  }
  
  // 先清空图表容器内容
  trainingChart.value.innerHTML = '';

  try {
    console.log('Initializing chart, container size:', trainingChart.value.offsetWidth, 'x', trainingChart.value.offsetHeight);
    const myChart = echarts.init(trainingChart.value);
    
    const option = {
    title: {
      text: '训练评分趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 500
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e6f7ff',
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['6月1日', '6月2日', '6月3日', '6月4日', '6月5日', '6月6日', '6月7日'],
      axisLine: {
        lineStyle: {
          color: '#d9d9d9'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '训练评分',
        type: 'line',
        data: [75, 82, 79, 84, 90, 88, 92],
        smooth: true,
        lineStyle: {
          color: '#1890ff',
          width: 3,
          shadowColor: 'rgba(0, 65, 170, 0.2)',
          shadowBlur: 10
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#1890ff',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24, 144, 255, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(24, 144, 255, 0.1)'
            }
          ])
        },
        markPoint: {
          data: [
            { type: 'max', name: '最高分' },
            { type: 'min', name: '最低分' }
          ],
          symbolSize: 45,
          itemStyle: {
            color: '#1890ff'
          }
        }
      }
    ]
  }
  
  myChart.setOption(option);
  
  // 监听窗口大小变化，自动调整图表大小
  window.addEventListener('resize', () => {
    myChart.resize();
  });
  
  } catch (error) {
    console.error('图表初始化失败:', error);
  }
}

// 生命周期保持onMounted，但增加错误处理
onMounted(() => {
  try {
    // 页面加载时立即加载数据
    refreshData(timeRange.value);
    
    // 确保DOM完全渲染后再初始化图表
    nextTick(() => {
      console.log('尝试初始化图表');
      initChart();
    });
  } catch (error) {
    console.error('首页初始化失败:', error);
    // 这里可以添加用户提示，例如使用 message.error('加载失败，请刷新重试');
  }
});

</script>

<style scoped>
@import '//at.alicdn.com/t/c/font_3945880_89ygu5j2ky.css'; /* 替换为你在iconfont.cn生成的图标库链接 */

.home-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
  position: relative;
}

/* 顶部搜索栏 */
.top-search-bar {
  margin-bottom: 24px;
  background: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.top-right-tools {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-box {
  width: 250px;
  margin-right: 16px;
}

.top-icon-btn {
  margin-left: 8px;
  display: flex;
  align-items: center;
}

/* 欢迎横幅 */
.welcome-card {
  margin-bottom: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 12px;
  overflow: hidden;
}

.welcome-banner {
  height: 240px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../assets/pingpong-pattern.png') repeat;
  opacity: 0.1;
}

.welcome-banner h1 {
  margin-bottom: 16px;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.welcome-banner p {
  font-size: 16px;
  max-width: 800px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.quick-start-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  color: #fff;
  font-weight: 500;
  height: 40px;
  padding: 0 24px;
  transition: all 0.3s;
}

.quick-start-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* 功能区 */
.section-container {
  margin-top: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: nowrap;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-right: 8px;
}

.section-icon {
  font-size: 24px;
  color: #1890ff;
  margin-right: 12px;
}

.current-range {
  display: inline-flex;
  margin-right: 16px;
  align-items: center;
}

.time-filter {
  margin-left: auto;
}

/* 核心功能图标 */
.core-feature-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #1890ff;
  border-radius: 50%;
  position: relative;
  margin-right: 12px;
}

.core-feature-icon::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: white;
  top: 11px;
  left: 4px;
}

.core-feature-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 16px;
  background: white;
  top: 4px;
  left: 11px;
}

/* 功能卡片重设计 */
.feature-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.icon-container {
  padding: 32px 0;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.feature-card:hover .icon-container {
  background: #f0f7ff;
}

.feature-svg {
  transition: all 0.3s;
}

.feature-card:hover .feature-svg {
  transform: scale(1.05);
}

.feature-content {
  padding: 16px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  margin-top: 0;
}

.feature-description {
  color: #666;
  margin: 0 0 20px;
  flex: 1;
  line-height: 1.6;
}

.feature-btn {
  background: #1890ff;
  border: none;
  height: 40px;
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;
  margin-top: auto;
}

.feature-btn:hover {
  background: #40a9ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

/* 数据统计 */
.data-overview-card {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-radius: 8px;
}

.data-stat-col {
  margin-bottom: 24px;
}

.data-metric-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.data-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.metric-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.metric-title {
  margin: 0 0 0 8px;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.stat-icon {
  margin-right: 6px;
  color: #1890ff;
  font-size: 18px;
}

.metric-value-container {
  margin-bottom: 12px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.metric-unit {
  font-size: 14px;
  color: #999;
  margin-left: 4px;
}

.metric-comparison {
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.comparison-label {
  font-size: 12px;
  color: #999;
  margin-left: 6px;
}

/* 进度条样式 */
.progress-container {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4a86e8;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 活动列表增强 */
.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-header .anticon {
  margin-right: 8px;
  color: #1890ff;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.activity-item {
  padding: 12px 0;
  transition: all 0.3s;
  border-radius: 4px;
}

.activity-item:hover {
  background: #f9f9f9;
}

.activity-avatar {
  background: #1890ff;
  transition: all 0.3s;
}

.activity-item:hover .activity-avatar {
  transform: scale(1.1);
}

.activity-score {
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
}

.score-excellent {
  color: #52c41a;
  background: #f6ffed;
}

.score-good {
  color: #1890ff;
  background: #e6f7ff;
}

.score-average {
  color: #fa8c16;
  background: #fff7e6;
}

.score-poor {
  color: #f5222d;
  background: #fff1f0;
}

.export-btn {
  margin-left: auto;
  padding: 0 8px;
}

.activity-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.activity-metrics {
  margin-top: 6px;
  display: flex;
  gap: 4px;
}

.activity-metrics .ant-tag {
  margin-right: 0;
}

/* AI助手悬浮按钮 */
.ai-assistant-floating {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 1000;
}

.ai-assistant-floating .ant-btn {
  width: 56px;
  height: 56px;
  background: linear-gradient(45deg, #1890ff, #722ed1);
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s;
}

.ai-assistant-floating .ant-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.ai-assistant-floating .anticon {
  font-size: 24px;
}

.assistant-tooltip {
  position: absolute;
  top: -30px;
  right: 0;
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
}

.ai-assistant-floating:hover .assistant-tooltip {
  opacity: 1;
  top: -35px;
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .top-search-bar {
    padding: 12px 16px;
    flex-direction: column;
  }

  .logo-container {
    margin-bottom: 12px;
  }

  .top-right-tools {
    justify-content: center;
    margin-top: 12px;
  }

  .search-box {
    width: 100%;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .welcome-banner {
    height: 220px;
    padding: 24px;
  }

  .welcome-banner h1 {
    font-size: 24px;
  }

  .welcome-banner p {
    font-size: 14px;
  }

  .chart-container {
    height: 300px;
  }

  .top-icon-btn span {
    display: none;
  }
  
  .section-header h2 {
    font-size: 18px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-filter {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
  }
  
  .time-filter .ant-select {
    width: 100%;
  }
  
  .activity-detail {
    align-items: flex-start;
    margin-top: 8px;
  }
  
  .activity-metrics {
    flex-wrap: wrap;
  }
  
  .ai-assistant-floating {
    right: 20px;
    bottom: 20px;
  }
  
  .ai-assistant-floating .ant-btn {
    width: 48px;
    height: 48px;
  }
}

/* 图表容器 */
.chart-container {
  height: 350px;
  min-height: 300px;
  display: block;
  position: relative;
}

.chart-row {
  margin-top: 24px;
}
</style> 