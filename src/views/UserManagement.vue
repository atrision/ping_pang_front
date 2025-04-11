<template>
  <div class="user-management">
    <a-row :gutter="16">
      <a-col :xs="24" :md="24" :lg="24">
        <a-card title="用户数据管理系统" :bordered="false">
          <p>系统化管理用户训练数据，方便查询、分析和导出，实现数据的高效管理和使用。</p>
        </a-card>
      </a-col>
    </a-row>

    <!-- 搜索和过滤区域 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="24">
        <a-card :bordered="false">
          <a-form layout="inline" :model="searchForm">
            <a-form-item label="用户姓名">
              <a-input v-model:value="searchForm.name" placeholder="请输入用户姓名" />
            </a-form-item>
            <a-form-item label="训练类型">
              <a-select 
                v-model:value="searchForm.trainingType" 
                style="width: 160px"
                placeholder="请选择训练类型"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="forehand">正手训练</a-select-option>
                <a-select-option value="backhand">反手训练</a-select-option>
                <a-select-option value="serve">发球训练</a-select-option>
                <a-select-option value="footwork">步法训练</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="时间范围">
              <a-range-picker v-model:value="searchForm.dateRange" style="width: 240px" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button style="margin-left: 8px" @click="resetSearch">
                重置
              </a-button>
            </a-form-item>
          </a-form>
          <a-divider style="margin: 16px 0" />
          <div class="table-operations">
            <a-button type="primary" @click="handleAdd">
              <template #icon><UserAddOutlined /></template>
              添加用户
            </a-button>
            <a-button style="margin-left: 8px" @click="handleExport">
              <template #icon><ExportOutlined /></template>
              导出数据
            </a-button>
            <a-button 
              danger 
              style="margin-left: 8px" 
              @click="handleBatchDelete"
              :disabled="selectedRowKeys.length === 0"
            >
              <template #icon><DeleteOutlined /></template>
              批量删除
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 数据表格 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="24">
        <a-card :bordered="false" :loading="loading">
          <a-table
            :columns="columns"
            :data-source="userData"
            :pagination="pagination"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :rowKey="record => record.id"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'name'">
                <a @click="showUserDetails(record)">{{ record.name }}</a>
              </template>
              <template v-if="column.dataIndex === 'gender'">
                <span>{{ record.gender === 'male' ? '男' : '女' }}</span>
              </template>
              <template v-if="column.dataIndex === 'trainingSessions'">
                <a-tag color="blue">{{ record.trainingSessions }}次</a-tag>
              </template>
              <template v-if="column.dataIndex === 'avgScore'">
                <a-progress 
                  :percent="record.avgScore" 
                  size="small" 
                  :status="getScoreStatus(record.avgScore)"
                  :stroke-color="getProgressColor(record.level)"
                />
              </template>
              <template v-if="column.dataIndex === 'lastTraining'">
                {{ formatDate(record.lastTraining) }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleEdit(record)">
                    <template #icon><EditOutlined /></template>
                    编辑
                  </a-button>
                  <a-button type="link" size="small" @click="showTrainingRecords(record)">
                    <template #icon><HistoryOutlined /></template>
                    训练记录
                  </a-button>
                  <a-popconfirm
                    title="确定要删除此用户吗？"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="handleDelete(record)"
                  >
                    <a-button type="link" size="small" danger>
                      <template #icon><DeleteOutlined /></template>
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- 用户编辑弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      :title="editingUser.id ? '编辑用户信息' : '添加新用户'"
      @ok="saveUser"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-form :model="editingUser" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="姓名" required>
          <a-input v-model:value="editingUser.name" placeholder="请输入用户姓名" />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="editingUser.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-model:value="editingUser.age" :min="1" :max="120" style="width: 100%" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="editingUser.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="电子邮箱">
          <a-input v-model:value="editingUser.email" placeholder="请输入电子邮箱" />
        </a-form-item>
        <a-form-item label="训练级别">
          <a-select v-model:value="editingUser.level">
            <a-select-option value="beginner">初级</a-select-option>
            <a-select-option value="intermediate">中级</a-select-option>
            <a-select-option value="advanced">高级</a-select-option>
            <a-select-option value="professional">专业级</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="editingUser.notes" :rows="4" placeholder="请输入备注信息" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 训练记录弹窗 -->
    <a-modal
      v-model:visible="trainingRecordsVisible"
      title="训练记录详情"
      :footer="null"
      :width="800"
    >
      <a-descriptions title="用户基本信息" bordered size="small">
        <a-descriptions-item label="姓名" span="1">{{ currentUser.name }}</a-descriptions-item>
        <a-descriptions-item label="性别" span="1">{{ currentUser.gender === 'male' ? '男' : '女' }}</a-descriptions-item>
        <a-descriptions-item label="年龄" span="1">{{ currentUser.age }}岁</a-descriptions-item>
        <a-descriptions-item label="训练级别" span="3">{{ formatLevel(currentUser.level) }}</a-descriptions-item>
      </a-descriptions>
      
      <a-divider />
      
      <a-table
        :columns="trainingColumns"
        :data-source="trainingRecords"
        :pagination="{ pageSize: 5 }"
        :rowKey="record => record.id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'trainingType'">
            <a-tag :color="getTrainingTypeColor(record.trainingType)">
              {{ formatTrainingType(record.trainingType) }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'score'">
            <a-progress :percent="record.score" size="small" :status="getScoreStatus(record.score)" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a @click="viewTrainingDetail(record)">查看详情</a>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 用户详情抽屉 -->
    <a-drawer
      v-model:visible="userDetailsVisible"
      :title="`${currentUser.name}的详细信息`"
      width="720"
      placement="right"
    >
      <a-descriptions title="用户基本信息" bordered>
        <a-descriptions-item label="姓名" span="1">{{ currentUser.name }}</a-descriptions-item>
        <a-descriptions-item label="性别" span="1">{{ currentUser.gender === 'male' ? '男' : '女' }}</a-descriptions-item>
        <a-descriptions-item label="年龄" span="1">{{ currentUser.age }}岁</a-descriptions-item>
        <a-descriptions-item label="联系电话" span="1">{{ currentUser.phone }}</a-descriptions-item>
        <a-descriptions-item label="电子邮箱" span="2">{{ currentUser.email }}</a-descriptions-item>
        <a-descriptions-item label="训练级别" span="3">{{ formatLevel(currentUser.level) }}</a-descriptions-item>
        <a-descriptions-item label="备注" span="3">{{ currentUser.notes || '无' }}</a-descriptions-item>
      </a-descriptions>
      
      <a-divider orientation="left">训练数据统计</a-divider>
      
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :lg="8">
          <a-statistic title="累计训练次数" :value="currentUser.trainingSessions" suffix="次" />
        </a-col>
        <a-col :xs="24" :sm="12" :lg="8">
          <a-statistic title="平均评分" :value="currentUser.avgScore" suffix="分" />
        </a-col>
        <a-col :xs="24" :sm="12" :lg="8">
          <a-statistic title="最近训练日期" :value="formatDate(currentUser.lastTraining)" />
        </a-col>
      </a-row>
      
      <a-divider orientation="left">训练进度图表</a-divider>
      
      <div ref="userTrainingChart" style="height: 300px"></div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import {
  SearchOutlined,
  UserAddOutlined,
  ExportOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  
  
} from '@ant-design/icons-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  trainingType: '',
  dateRange: null
})

// 表格相关
const loading = ref(false)
const userData = ref([])
const selectedRowKeys = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
})

// 列定义
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    sorter: true,
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    filters: [
      { text: '男', value: 'male' },
      { text: '女', value: 'female' }
    ],
    width: '10%'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    sorter: true,
    width: '10%'
  },
  {
    title: '训练级别',
    dataIndex: 'level',
    filters: [
      { text: '初级', value: 'beginner' },
      { text: '中级', value: 'intermediate' },
      { text: '高级', value: 'advanced' },
      { text: '专业级', value: 'professional' }
    ],
    width: '10%',
    customRender: ({ text }) => formatLevel(text)
  },
  {
    title: '累计训练次数',
    dataIndex: 'trainingSessions',
    sorter: true,
    width: '15%'
  },
  {
    title: '平均评分',
    dataIndex: 'avgScore',
    sorter: true,
    width: '15%'
  },
  {
    title: '最近训练日期',
    dataIndex: 'lastTraining',
    sorter: true,
    width: '15%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '20%'
  }
]

// 训练记录列定义
const trainingColumns = [
  {
    title: '训练日期',
    dataIndex: 'date',
    width: '20%'
  },
  {
    title: '训练类型',
    dataIndex: 'trainingType',
    width: '20%'
  },
  {
    title: '时长',
    dataIndex: 'duration',
    width: '15%',
    customRender: ({ text }) => `${text}分钟`
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: '25%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '20%'
  }
]

// 模态框和抽屉相关
const editModalVisible = ref(false)
const trainingRecordsVisible = ref(false)
const userDetailsVisible = ref(false)
const editingUser = reactive({
  id: null,
  name: '',
  gender: 'male',
  age: 25,
  phone: '',
  email: '',
  level: 'beginner',
  notes: '',
  trainingSessions: 0,
  avgScore: 0,
  lastTraining: ''
})
const currentUser = ref({})
const trainingRecords = ref([])
const userTrainingChart = ref(null)
let chartInstance = null

// 获取用户数据
const fetchUserData = () => {
  loading.value = true
  
  // 这里应该调用实际API获取数据
  // 以下为模拟数据
  setTimeout(() => {
    userData.value = generateMockUserData()
    pagination.total = 100
    loading.value = false
  }, 800)
}

// 生成模拟用户数据
const generateMockUserData = () => {
  const data = []
  for (let i = 1; i <= 20; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female'
    const levels = ['beginner', 'intermediate', 'advanced', 'professional']
    const level = levels[Math.floor(Math.random() * levels.length)]
    const trainingSessions = Math.floor(Math.random() * 50) + 10
    const avgScore = Math.floor(Math.random() * 30) + 70
    
    const today = new Date()
    const daysAgo = Math.floor(Math.random() * 30)
    const lastTraining = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    
    data.push({
      id: i,
      name: `用户${i}`,
      gender,
      age: Math.floor(Math.random() * 40) + 10,
      phone: `1${Math.floor(Math.random() * 10000000000)}`.slice(0, 11),
      email: `user${i}@example.com`,
      level,
      trainingSessions,
      avgScore,
      lastTraining,
      notes: `这是用户${i}的备注信息。`
    })
  }
  return data
}

// 格式化训练类型
const formatTrainingType = (type) => {
  const typeMap = {
    'forehand': '正手训练',
    'backhand': '反手训练',
    'serve': '发球训练',
    'footwork': '步法训练',
    'match': '比赛模拟'
  }
  return typeMap[type] || type
}

// 获取训练类型颜色
const getTrainingTypeColor = (type) => {
  const colorMap = {
    'forehand': 'blue',
    'backhand': 'green',
    'serve': 'purple',
    'footwork': 'orange',
    'match': 'red'
  }
  return colorMap[type] || 'blue'
}

// 获取评分状态
const getScoreStatus = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'active'
  return 'exception'
}

// 格式化训练级别
const formatLevel = (level) => {
  const levelMap = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级',
    'professional': '专业级'
  }
  return levelMap[level] || level
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 行选择变化
const onSelectChange = (keys) => {
  selectedRowKeys.value = keys
}

// 表格变化
const handleTableChange = (pag, filters, sorter) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  
  // 记录日志或使用参数
  console.log('表格过滤条件:', filters, '排序条件:', sorter)
  
  // 根据排序和过滤条件重新加载数据
  fetchUserData()
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchUserData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.trainingType = ''
  searchForm.dateRange = null
  pagination.current = 1
  fetchUserData()
}

// 添加用户
const handleAdd = () => {
  Object.assign(editingUser, {
    id: null,
    name: '',
    gender: 'male',
    age: 25,
    phone: '',
    email: '',
    level: 'beginner',
    notes: '',
    trainingSessions: 0,
    avgScore: 0,
    lastTraining: ''
  })
  editModalVisible.value = true
}

// 编辑用户
const handleEdit = (record) => {
  Object.assign(editingUser, { ...record })
  editModalVisible.value = true
}

// 删除用户
const handleDelete = (record) => {
  // 实际项目中应该调用API删除数据
  message.success(`已删除用户: ${record.name}`)
  userData.value = userData.value.filter(user => user.id !== record.id)
}

// 批量删除
const handleBatchDelete = () => {
  // 实际项目中应该调用API批量删除数据
  message.success(`已批量删除 ${selectedRowKeys.value.length} 名用户`)
  userData.value = userData.value.filter(user => !selectedRowKeys.value.includes(user.id))
  selectedRowKeys.value = []
}

// 导出数据
const handleExport = () => {
  message.success('数据导出成功')
}

// 保存用户
const saveUser = () => {
  if (!editingUser.name) {
    message.error('用户姓名不能为空')
    return
  }
  
  // 实际项目中应该调用API保存数据
  if (editingUser.id) {
    // 更新现有用户
    const index = userData.value.findIndex(user => user.id === editingUser.id)
    if (index !== -1) {
      userData.value[index] = { ...editingUser }
      message.success(`已更新用户: ${editingUser.name}`)
    }
  } else {
    // 添加新用户
    const newUser = { 
      ...editingUser, 
      id: userData.value.length + 1,
      trainingSessions: 0,
      avgScore: 0,
      lastTraining: new Date()
    }
    userData.value.unshift(newUser)
    message.success(`已添加用户: ${newUser.name}`)
  }
  
  editModalVisible.value = false
}

// 查看训练记录
const showTrainingRecords = (record) => {
  currentUser.value = { ...record }
  trainingRecords.value = generateMockTrainingRecords()
  trainingRecordsVisible.value = true
}

// 查看用户详情
const showUserDetails = (record) => {
  currentUser.value = { ...record }
  userDetailsVisible.value = true
  
  // 延迟初始化图表，确保DOM已渲染
  setTimeout(() => {
    initUserChart()
  }, 300)
}

// 查看训练详情
const viewTrainingDetail = (record) => {
  message.info(`查看训练详情: ${record.date} ${formatTrainingType(record.trainingType)}`)
}

// 生成模拟训练记录
const generateMockTrainingRecords = () => {
  const types = ['forehand', 'backhand', 'serve', 'footwork', 'match']
  const records = []
  
  const today = new Date()
  for (let i = 1; i <= 20; i++) {
    const daysAgo = Math.floor(Math.random() * 60)
    const date = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const type = types[Math.floor(Math.random() * types.length)]
    const duration = Math.floor(Math.random() * 60) + 30
    const score = Math.floor(Math.random() * 30) + 70
    
    records.push({
      id: i,
      date: formatDate(date),
      trainingType: type,
      duration,
      score,
      details: `这是关于${formatTrainingType(type)}训练的详细记录。`
    })
  }
  
  return records.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 初始化用户训练图表
const initUserChart = () => {
  if (!userTrainingChart.value) return
  
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  chartInstance = echarts.init(userTrainingChart.value)
  
  // 模拟6个月的训练数据
  const months = []
  const scores = []
  const sessions = []
  
  const today = new Date()
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthStr = `${month.getFullYear()}/${month.getMonth() + 1}`
    months.push(monthStr)
    
    scores.push(Math.floor(Math.random() * 20) + 70)
    sessions.push(Math.floor(Math.random() * 10) + 5)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['训练评分', '训练次数']
    },
    xAxis: [
      {
        type: 'category',
        data: months,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '评分',
        min: 0,
        max: 100,
        interval: 20
      },
      {
        type: 'value',
        name: '次数',
        min: 0,
        max: 20,
        interval: 5
      }
    ],
    series: [
      {
        name: '训练评分',
        type: 'line',
        smooth: true,
        data: scores,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        }
      },
      {
        name: '训练次数',
        type: 'bar',
        yAxisIndex: 1,
        data: sessions,
        barWidth: 20
      }
    ]
  }
  
  chartInstance.setOption(option)
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    chartInstance.resize()
  })
}

// 添加进度条颜色函数
const getProgressColor = (level) => {
  switch(level) {
    case 'beginner': return '#ff4d4f'; // 初级-红色
    case 'intermediate': return '#faad14'; // 中级-黄色
    case 'advanced': return '#1890ff'; // 高级-蓝色
    case 'professional': return '#52c41a'; // 专业级-绿色
    default: return '';
  }
}

// 初始化
onMounted(() => {
  fetchUserData()
})

// 监听抽屉关闭，清理图表实例
watch(userDetailsVisible, (visible) => {
  if (!visible && chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.user-management {
  padding: 16px;
}

.table-operations {
  margin-bottom: 16px;
}

.danger-link {
  color: #ff4d4f;
}

.danger-link:hover {
  color: #ff7875;
}

@media (max-width: 768px) {
  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }
}
</style>