<template>
  <div class="training-visualization">
    <a-row :gutter="16">
      <a-col :xs="24" :md="24" :lg="24">
        <a-card title="训练指标数据可视化" :bordered="false">
          <p>通过多种图表直观展示训练指标数据，让训练效果一目了然，支持时间筛选和数据对比。</p>
        </a-card>
      </a-col>
    </a-row>

    <!-- 时间筛选器 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="24">
        <a-card :bordered="false">
          <a-space>
            <a-radio-group v-model="timeRange" @change="handleTimeRangeChange">
              <a-radio-button value="week">近一周</a-radio-button>
              <a-radio-button value="month">近一月</a-radio-button>
              <a-radio-button value="quarter">近三月</a-radio-button>
              <a-radio-button value="year">近一年</a-radio-button>
              <a-radio-button value="custom">自定义</a-radio-button>
            </a-radio-group>
            
            <a-range-picker 
              v-if="timeRange === 'custom'"
              v-model="customDateRange"
              @change="handleDateRangeChange"
              :allowClear="false"
              style="width: 280px;"
            />
            
            <a-select 
              v-model="selectedTrainingType" 
              style="width: 160px"
              placeholder="训练类型"
              @change="handleTrainingTypeChange"
            >
              <a-select-option value="all">全部类型</a-select-option>
              <a-select-option value="forehand">正手训练</a-select-option>
              <a-select-option value="backhand">反手训练</a-select-option>
              <a-select-option value="serve">发球训练</a-select-option>
              <a-select-option value="footwork">步法训练</a-select-option>
            </a-select>
            
            <a-button 
              type="primary" 
              @click="refreshData"
              :loading="loading"
            >
              刷新数据
            </a-button>
            
            <a-button @click="exportData">
              导出数据
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- 总体进度与评分统计 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :xs="24" :sm="12" :lg="6" v-for="(stat, index) in statisticsData" :key="index">
        <a-card :bordered="false">
          <template #title>
            <div class="stat-title">
              <component :is="stat.icon" style="font-size: 24px; margin-right: 8px" />
              <span>{{ stat.title }}</span>
            </div>
          </template>
          <div class="stat-value">
            <span class="main-value">{{ stat.value }}</span>
            <span class="value-change" :class="{ 'increase': stat.change > 0, 'decrease': stat.change < 0 }">
              {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
            </span>
          </div>
          <a-progress :percent="stat.percent" :status="stat.status" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 训练进度图表 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :xs="24" :lg="12">
        <a-card title="训练评分趋势" :bordered="false" :loading="loading">
          <div ref="scoreChart" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card title="训练时长分布" :bordered="false" :loading="loading">
          <div ref="durationChart" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 技术指标分析 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="24">
        <a-card title="技术指标分析" :bordered="false" :loading="loading">
          <div ref="radarChart" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 技术进步详情 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :xs="24" :md="12">
        <a-card title="各项技术进步详情" :bordered="false" :loading="loading">
          <div ref="progressChart" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card title="智能分析建议" :bordered="false">
          <a-timeline>
            <a-timeline-item color="green">
              <h4>正手技术</h4>
              <p>正手击球力量有所提升，但击球点位置稍有不稳定，建议加强前臂发力训练和击球点稳定性训练。</p>
            </a-timeline-item>
            <a-timeline-item color="blue">
              <h4>反手技术</h4>
              <p>反手拉球质量明显提高，建议继续保持，同时可以适当增加反手攻球训练。</p>
            </a-timeline-item>
            <a-timeline-item color="red">
              <h4>步法移动</h4>
              <p>步法移动速度需要提升，建议增加专项步法训练和体能训练。</p>
            </a-timeline-item>
            <a-timeline-item color="orange">
              <h4>发球技术</h4>
              <p>发球质量稳定，但变化不够丰富，建议尝试练习不同旋转的发球技术。</p>
            </a-timeline-item>
          </a-timeline>
          <a-button type="primary" style="margin-top: 16px" @click="generateDetailReport">
            生成详细分析报告
          </a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import {
  TrophyOutlined,
  FieldTimeOutlined,
  FireOutlined,
  RiseOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const loading = ref(false)
const timeRange = ref('week')
const customDateRange = ref([])
const selectedTrainingType = ref('all')

// 增加独立的图表加载状态
const chartLoading = ref({
  score: true,
  duration: true,
  radar: true,
  progress: true
})

// 图表引用
const scoreChart = ref(null)
const durationChart = ref(null)
const radarChart = ref(null)
const progressChart = ref(null)

// 图表实例
let scoreChartInstance = null
let durationChartInstance = null
let radarChartInstance = null
let progressChartInstance = null

// 统计数据
const statisticsData = ref([
  {
    title: '总体评分',
    value: '86分',
    change: 4.2,
    percent: 86,
    status: 'active',
    icon: TrophyOutlined
  },
  {
    title: '训练时长',
    value: '32小时',
    change: 12.5,
    percent: 75,
    status: 'active',
    icon: FieldTimeOutlined
  },
  {
    title: '技术指数',
    value: '78分',
    change: 6.8,
    percent: 78,
    status: 'active',
    icon: FireOutlined
  },
  {
    title: '进步速度',
    value: '较快',
    change: -2.3,
    percent: 65,
    status: 'active',
    icon: RiseOutlined
  }
])

// 处理时间范围变化
const handleTimeRangeChange = (e) => {
  const value = e.target.value
  if (value !== 'custom') {
    loadDataByTimeRange(value)
  }
}

// 处理自定义日期范围变化
const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
    loadDataByDateRange(dates[0], dates[1])
  }
}

// 处理训练类型变化
const handleTrainingTypeChange = () => {
  refreshTrainingCharts()
}

// 根据时间范围加载数据
const loadDataByTimeRange = (range) => {
  loading.value = true
  
  // 使用range参数或记录日志
  console.log('加载时间范围数据:', range)
  
  setTimeout(() => {
    refreshCharts()
    loading.value = false
  }, 800)
}

// 根据日期范围加载数据
const loadDataByDateRange = (startDate, endDate) => {
  loading.value = true
  
  // 使用参数或记录日志
  console.log('加载日期区间数据:', startDate, '至', endDate)
  
  setTimeout(() => {
    refreshCharts()
    loading.value = false
  }, 800)
}

// 根据训练类型加载数据
// const loadDataByTrainingType = (type) => {
//   loading.value = true
  
//   // 使用type参数或记录日志
//   console.log('加载训练类型数据:', type)
  
//   setTimeout(() => {
//     refreshCharts()
//     loading.value = false
//   }, 800)
// }

// 刷新数据
const refreshData = () => {
  loading.value = true
  
  // 实际项目中应该调用API获取数据
  // 这里使用setTimeout模拟API调用
  setTimeout(() => {
    refreshCharts()
    loading.value = false
    message.success('数据已刷新')
  }, 1000)
}

// 页面加载时初始化
onMounted(() => {
  // 确保DOM完全渲染后再初始化图表
  nextTick(() => {
    // 初始化时延迟200ms确保DOM已完全渲染
    setTimeout(() => {
      initCharts()
      loadData()
    
      // 添加resize事件监听，使用防抖函数优化性能
      window.addEventListener('resize', debouncedResize)
    }, 200)
  })
})

// 初始化所有图表
const initCharts = () => {
  // 初始化前设置加载状态
  Object.keys(chartLoading.value).forEach(key => {
    chartLoading.value[key] = true
  })
  
  // 确保DOM完全渲染后再初始化图表
  nextTick(() => {
    // 延迟100ms确保DOM已完全渲染
    setTimeout(() => {
      try {
        // 检查容器是否存在
        if (!scoreChart.value || !durationChart.value || 
            !radarChart.value || !progressChart.value) {
          console.warn('图表容器未就绪，500ms后重试')
          setTimeout(initCharts, 500)
          return
        }
        
        // 使用安全的图表初始化方法
        scoreChartInstance = safeInitChart(scoreChart, getScoreChartOption())
        durationChartInstance = safeInitChart(durationChart, getDurationChartOption())
        radarChartInstance = safeInitChart(radarChart, getRadarChartOption())
        progressChartInstance = safeInitChart(progressChart, getProgressChartOption())
        
        // 检查是否有任何图表初始化失败
        if (!scoreChartInstance || !durationChartInstance || 
            !radarChartInstance || !progressChartInstance) {
          console.warn('部分图表初始化失败，500ms后重试')
          setTimeout(initCharts, 500)
          return
        }
        
        console.log('所有图表初始化完成')
      } catch (error) {
        console.error('图表初始化失败:', error)
        // 出错时尝试延迟重新初始化
        setTimeout(initCharts, 500)
      } finally {
        // 更新加载状态
        setTimeout(() => {
          Object.keys(chartLoading.value).forEach(key => {
            chartLoading.value[key] = false
          })
        }, 500)
      }
    }, 100)
  })
}

// 安全的图表初始化方法
const safeInitChart = (chartRef, option) => {
  if (!chartRef.value) {
    console.warn('图表容器未就绪，延迟初始化')
    return null
  }
  
  try {
    // 检查DOM元素是否已渲染并有尺寸
    if (!chartRef.value.offsetWidth || !chartRef.value.offsetHeight) {
      console.warn('图表容器尺寸为0，延迟初始化')
      return null
    }
    
    const instance = echarts.init(chartRef.value)
    instance.setOption(option)
    return instance
  } catch (error) {
    console.error('图表初始化失败:', error)
    return null
  }
}

// 获取评分趋势图表配置
const getScoreChartOption = () => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100
    },
    series: [{
      data: [85, 88, 82, 90, 87, 89, 86],
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.1
      },
      animationDuration: 1000
    }]
  }
}

// 获取训练时长分布图表配置
const getDurationChartOption = () => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 35, name: '正手训练' },
        { value: 25, name: '反手训练' },
        { value: 20, name: '发球训练' },
        { value: 15, name: '步法训练' },
        { value: 5, name: '其他' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animationDuration: 1000
    }]
  }
}

// 获取技术指标分析雷达图配置
const getRadarChartOption = () => {
  return {
    tooltip: {},
    radar: {
      indicator: [
        { name: '正手技术', max: 100 },
        { name: '反手技术', max: 100 },
        { name: '发球技术', max: 100 },
        { name: '步法移动', max: 100 },
        { name: '战术意识', max: 100 },
        { name: '体能素质', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
        value: [85, 78, 90, 75, 82, 80],
        name: '当前水平'
      }],
      animationDuration: 1000
    }]
  }
}

// 获取技术进步详情图配置
const getProgressChartOption = () => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['当前水平', '目标水平']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['正手技术', '反手技术', '发球技术', '步法移动', '战术意识', '体能素质']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100
    },
    series: [{
      name: '当前水平',
      type: 'bar',
      data: [85, 78, 90, 75, 82, 80],
      animationDuration: 1000
    }, {
      name: '目标水平',
      type: 'bar',
      data: [90, 85, 95, 85, 90, 85],
      animationDuration: 1000
    }]
  }
}

// 刷新所有图表
const refreshCharts = () => {
  if (scoreChartInstance) scoreChartInstance.resize()
  if (durationChartInstance) durationChartInstance.resize()
  if (radarChartInstance) radarChartInstance.resize()
  if (progressChartInstance) progressChartInstance.resize()
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用后端API获取实际数据
    // const response = await getTrainingData({
    //   timeRange: timeRange.value,
    //   startDate: customDateRange.value[0],
    //   endDate: customDateRange.value[1],
    //   trainingType: selectedTrainingType.value
    // })
    
    // 模拟数据加载延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 更新图表数据
    refreshCharts()
  } catch (error) {
    message.error('加载数据失败')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 导出数据
const exportData = () => {
  // TODO: 实现数据导出功能
  message.success('数据导出功能开发中')
}

// 生成详细分析报告
const generateDetailReport = () => {
  router.push('/report/generate')
}

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', refreshCharts)
  if (scoreChartInstance) scoreChartInstance.dispose()
  if (durationChartInstance) durationChartInstance.dispose()
  if (radarChartInstance) radarChartInstance.dispose()
  if (progressChartInstance) progressChartInstance.dispose()
})

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 响应窗口大小变化的重绘函数
const resizeCharts = () => {
  // 检查图表实例是否存在，如果不存在，则重新初始化
  let needsReInit = false
  
  if (!scoreChartInstance || !durationChartInstance || 
      !radarChartInstance || !progressChartInstance) {
    needsReInit = true
  }
  
  if (needsReInit) {
    console.log('检测到图表实例不存在，重新初始化')
    initCharts()
    return
  }
  
  // 所有图表实例存在，执行resize操作
  try {
    if (scoreChartInstance) scoreChartInstance.resize()
    if (durationChartInstance) durationChartInstance.resize()
    if (radarChartInstance) radarChartInstance.resize()
    if (progressChartInstance) progressChartInstance.resize()
  } catch (error) {
    console.error('图表重绘失败:', error)
    // 如果resize失败，可能需要重新初始化
    setTimeout(initCharts, 300)
  }
}

// 防抖处理后的resize函数
const debouncedResize = debounce(resizeCharts, 300)

// 手动刷新训练图表
const refreshTrainingCharts = debounce(() => {
  // 检查图表实例是否存在
  if (!scoreChartInstance || !durationChartInstance || 
      !radarChartInstance || !progressChartInstance) {
    console.log('检测到图表实例不存在，重新初始化')
    initCharts()
    return
  }
  
  // 更新各图表的数据
  updateScoreChart()
  updateDurationChart()
  updateRadarChart()
  updateProgressChart()
}, 300)

// 更新评分趋势图
const updateScoreChart = () => {
  if (!scoreChartInstance) return
  chartLoading.value.score = true
  
  // 模拟API请求更新数据
  setTimeout(() => {
    const newOption = getScoreChartOption()
    // 这里可以根据selectedTrainingType更新数据
    scoreChartInstance.setOption(newOption)
    chartLoading.value.score = false
  }, 500)
}

// 更新训练时长分布图
const updateDurationChart = () => {
  if (!durationChartInstance) return
  chartLoading.value.duration = true
  
  // 模拟API请求更新数据
  setTimeout(() => {
    const newOption = getDurationChartOption()
    // 这里可以根据selectedTrainingType更新数据
    durationChartInstance.setOption(newOption)
    chartLoading.value.duration = false
  }, 500)
}

// 更新技术指标雷达图
const updateRadarChart = () => {
  if (!radarChartInstance) return
  chartLoading.value.radar = true
  
  // 模拟API请求更新数据
  setTimeout(() => {
    const newOption = getRadarChartOption()
    // 这里可以根据selectedTrainingType更新数据
    radarChartInstance.setOption(newOption)
    chartLoading.value.radar = false
  }, 500)
}

// 更新技术进步详情图
const updateProgressChart = () => {
  if (!progressChartInstance) return
  chartLoading.value.progress = true
  
  // 模拟API请求更新数据
  setTimeout(() => {
    const newOption = getProgressChartOption()
    // 这里可以根据selectedTrainingType更新数据
    progressChartInstance.setOption(newOption)
    chartLoading.value.progress = false
  }, 500)
}
</script>

<style scoped>
.training-visualization {
  padding: 16px;
}

.stat-title {
  display: flex;
  align-items: center;
}

.stat-value {
  margin-bottom: 12px;
}

.main-value {
  font-size: 24px;
  font-weight: bold;
  margin-right: 8px;
}

.value-change {
  font-size: 14px;
}

.increase {
  color: #52c41a;
}

.decrease {
  color: #f5222d;
}

@media (max-width: 768px) {
  .a-space {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .a-radio-group {
    margin-bottom: 8px;
  }
}

/* 图表容器样式 */
.chart-container {
  height: 350px;
  width: 100%;
  min-height: 300px;
  position: relative;
}

/* 响应式图表调整 */
@media (max-width: 768px) {
  .chart-container {
    height: 300px; /* 移动端稍微降低高度 */
  }
  
  /* 确保图表能在小屏幕上正确显示 */
  [class*="echarts-container"] {
    width: 100% !important;
  }
}
</style> 