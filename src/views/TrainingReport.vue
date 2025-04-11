<template>
  <div class="training-report">
    <a-row :gutter="16">
      <a-col :xs="24" :md="24" :lg="24">
        <a-card title="训练建议报告生成" :bordered="false">
          <p>基于训练数据和分析结果，生成个性化的训练建议报告，助力技术提升。</p>
        </a-card>
      </a-col>
    </a-row>

    <!-- 报告生成配置 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="24">
        <a-card :bordered="false">
          <a-steps :current="currentStep" size="small">
            <a-step title="选择模板" />
            <a-step title="选择数据" />
            <a-step title="编辑内容" />
            <a-step title="生成报告" />
          </a-steps>
        </a-card>
      </a-col>
    </a-row>

    <!-- 报告内容 -->
    <a-row :gutter="16" style="margin-top: 20px">
      <a-col :span="24">
        <a-card :bordered="false" :loading="loading">
          <!-- 步骤1：选择模板 -->
          <div v-if="currentStep === 0">
            <a-radio-group v-model="selectedTemplate" button-style="solid" style="margin-bottom: 20px">
              <a-radio-button value="standard">标准模板</a-radio-button>
              <a-radio-button value="detailed">详细模板</a-radio-button>
              <a-radio-button value="simple">简洁模板</a-radio-button>
              <a-radio-button value="coach">教练专用</a-radio-button>
            </a-radio-group>
            
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12" :md="8" v-for="template in templateList" :key="template.id">
                <a-card 
                  hoverable 
                  :class="['template-card', selectedTemplate === template.id ? 'selected-template' : '']"
                  @click="selectedTemplate = template.id"
                >
                  <div class="template-icon-container">
                    <div class="template-icon" :style="{ backgroundColor: template.color }">
                      <component :is="template.icon" style="font-size: 48px; color: white;" />
                    </div>
                  </div>
                  <div class="template-info">
                    <h3>{{ template.name }}</h3>
                    <p>{{ template.description }}</p>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>

          <!-- 步骤2：选择数据 -->
          <div v-if="currentStep === 1">
            <div class="data-selection">
              <a-alert message="请选择用于生成报告的训练数据范围和类型" type="info" show-icon style="margin-bottom: 20px" />
              
              <a-form layout="vertical">
                <a-row :gutter="16">
                  <a-col :xs="24" :md="12">
                    <a-form-item label="时间范围">
                      <a-range-picker 
                        v-model="dateRange" 
                        style="width: 100%" 
                        format="YYYY-MM-DD"
                      />
                    </a-form-item>
                  </a-col>
                  
                  <a-col :xs="24" :md="12">
                    <a-form-item label="训练类型">
                      <a-select 
                        v-model="trainingTypes" 
                        mode="multiple" 
                        placeholder="请选择训练类型"
                        style="width: 100%"
                      >
                        <a-select-option value="forehand">正手训练</a-select-option>
                        <a-select-option value="backhand">反手训练</a-select-option>
                        <a-select-option value="serve">发球训练</a-select-option>
                        <a-select-option value="footwork">步法训练</a-select-option>
                        <a-select-option value="match">比赛模拟</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item label="选择分析会话">
                  <div class="session-selection-header">
                    <a-radio-group v-model="selectionMode" style="margin-bottom: 16px">
                      <a-radio-button value="single">单选模式</a-radio-button>
                      <a-radio-button value="multiple">多选模式</a-radio-button>
                    </a-radio-group>
                    <a-button 
                      v-if="selectionMode === 'multiple'" 
                      type="link" 
                      @click="selectAllSessions"
                      style="margin-left: 16px"
                    >
                      全选
                    </a-button>
                  </div>
                  <a-table
                    :columns="sessionColumns"
                    :data-source="sessionData"
                    :row-selection="{ 
                      type: selectionMode === 'single' ? 'radio' : 'checkbox',
                      selectedRowKeys: selectedSessions, 
                      onChange: onSessionSelectionChange 
                    }"
                    :pagination="{ pageSize: 5 }"
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
                    </template>
                  </a-table>
                </a-form-item>
              </a-form>
            </div>
          </div>

          <!-- 步骤3：编辑内容 -->
          <div v-if="currentStep === 2">
            <!-- 调试信息 -->
            <!-- <div v-if="process.env.NODE_ENV !== 'production'" style="background: #f5f5f5; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
              <p><strong>调试信息:</strong></p>
              <p>标题: {{ reportTitle || '未设置' }}</p>
              <p>摘要: {{ reportSummary ? '已设置 (' + reportSummary.length + '字符)' : '未设置' }}</p>
              <p>章节数量: {{ reportSections.length }}</p>
              <a-button size="small" @click="() => console.log('当前报告数据:', {title: reportTitle, summary: reportSummary, sections: reportSections})">
                打印当前数据
              </a-button>
            </div> -->
            
            <a-form layout="vertical">
              <a-form-item label="报告标题">
                <a-input 
                  :value="reportTitle" 
                  @change="e => updateReportTitle(e.target.value)" 
                  placeholder="请输入报告标题" 
                />
              </a-form-item>
              
              <a-form-item label="报告摘要">
                <a-textarea 
                  :value="reportSummary" 
                  @change="e => updateReportSummary(e.target.value)" 
                  placeholder="请输入报告摘要内容" 
                  :rows="4" 
                />
              </a-form-item>
              
              <a-divider orientation="left">报告章节</a-divider>
              
              <div v-for="(section, index) in reportSections" :key="'section-'+index" class="report-section">
                <a-space align="baseline" style="margin-bottom: 8px">
                  <h3>章节 {{ index + 1 }}</h3>
                  <a-button 
                    type="text" 
                    danger 
                    @click="removeSection(index)" 
                    v-if="reportSections.length > 1"
                  >
                    删除
                  </a-button>
                </a-space>
                
                <a-input 
                  :value="section.title" 
                  @change="e => updateSectionTitle(index, e.target.value)"
                  placeholder="章节标题" 
                  style="margin-bottom: 8px" 
                />
                
                <a-textarea 
                  :value="section.content" 
                  @change="e => updateSectionContent(index, e.target.value)"
                  placeholder="章节内容" 
                  :rows="6" 
                />
              </div>
              
              <a-button type="dashed" block @click="addSection" style="margin-top: 16px">
                <template #icon><PlusOutlined /></template>
                添加章节
              </a-button>
              
              <!-- 测试按钮 -->
              <!-- <a-button type="link" @click="testDataBinding" style="margin-top: 8px">
                测试数据绑定
              </a-button> -->
              
              <a-divider orientation="left">结论与建议</a-divider>
              
              <a-form-item label="结论">
                <a-textarea 
                  :value="reportConclusion" 
                  @change="e => updateReportConclusion(e.target.value)" 
                  placeholder="请输入结论内容" 
                  :rows="4" 
                />
              </a-form-item>
              
              <a-form-item label="训练建议">
                <a-textarea 
                  :value="reportSuggestions" 
                  @change="e => updateReportSuggestions(e.target.value)" 
                  placeholder="请输入训练建议内容" 
                  :rows="4" 
                />
              </a-form-item>
              
              <a-form-item>
                <a-button type="primary" @click="generateAiContent">
                  <template #icon><RobotOutlined /></template>
                  使用文心大模型生成内容
                </a-button>
              </a-form-item>
            </a-form>

            <!-- 调试显示，验证数据存在 -->
            <!-- <div style="background:#f5f5f5;padding:10px;margin:10px 0;border-radius:4px;">
              <div><strong>数据验证:</strong></div>
              <div>章节数量: {{ reportSections.length }}</div>
              <div v-if="reportSections.length > 0">
                第一章标题: <span style="color:#1890ff">{{ reportSections[0].title }}</span>
                <br>
                内容长度: {{ reportSections[0].content?.length || 0 }}字符
              </div>
              <div v-else>
                暂无章节数据
              </div>
            </div> -->
          </div>

          <!-- 步骤4：生成报告 -->
          <div v-if="currentStep === 3">
            <div class="report-preview">
              <a-alert message="报告预览" type="success" show-icon style="margin-bottom: 20px" />
              
              <div class="report-container">
                <div class="report-header">
                  <h1>{{ reportTitle || '训练分析报告' }}</h1>
                  <p class="report-date">生成日期: {{ formatDate(new Date()) }}</p>
                </div>
                
                <div class="report-summary">
                  <h2>摘要</h2>
                  <p>{{ reportSummary || '本报告基于选定的训练数据，对训练效果进行了全面分析，并提供了个性化的训练建议。' }}</p>
                </div>
                
                <div v-for="(section, index) in reportSections" :key="index" class="report-section-content">
                  <h2>{{ section.title || `章节 ${index + 1}` }}</h2>
                  <div v-html="formatContent(section.content)"></div>
                </div>
                
                <div class="report-conclusion">
                  <h2>结论</h2>
                  <p>{{ reportConclusion || '通过分析，可以看出训练整体效果良好，但仍有提升空间。' }}</p>
                </div>
                
                <div class="report-suggestions">
                  <h2>训练建议</h2>
                  <p>{{ reportSuggestions || '建议加强技术动作的规范性训练，增加实战模拟练习。' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div class="steps-action" style="margin-top: 24px">
            <a-button 
              v-if="currentStep > 0" 
              style="margin-right: 8px" 
              @click="prev"
            >
              上一步
            </a-button>
            <a-button 
              v-if="currentStep < 3" 
              type="primary" 
              @click="next"
            >
              下一步
            </a-button>
            <a-button 
              v-if="currentStep === 3" 
              type="primary" 
              @click="handleSaveReport"
              :loading="saveLoading"
            >
              保存报告
            </a-button>
            <a-button
              v-if="currentStep === 3"
              style="margin-left: 8px"
              @click="handleExportReport"
              :loading="exportLoading"
            >
              导出PDF
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '@/utils'
import { 
  PlusOutlined, 
  RobotOutlined,
  FolderOutlined,
  ZoomInOutlined,
  MinusCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue'
import { getModelAnalysis, saveReport, exportReportPDF } from '@/api/report'

// 当前步骤
const currentStep = ref(0)

// 加载状态
const loading = ref(false)
const saveLoading = ref(false)
const exportLoading = ref(false)
const currentReportId = ref(null) // 当前报告ID

// 步骤1：模板选择
const selectedTemplate = ref('standard')
const templateList = [
  {
    id: 'standard',
    name: '标准训练报告',
    description: '包含完整的训练数据分析和建议',
    icon: FolderOutlined,
    color: '#1890ff'
  },
  {
    id: 'detailed',
    name: '详细训练报告',
    description: '提供深入的技术分析和详细建议',
    icon: ZoomInOutlined,
    color: '#52c41a'
  },
  {
    id: 'simple',
    name: '简洁训练报告',
    description: '简明扼要的训练总结和关键建议',
    icon: MinusCircleOutlined,
    color: '#fa8c16'
  },
  {
    id: 'coach',
    name: '教练专用报告',
    description: '针对教练的专业训练分析报告',
    icon: TrophyOutlined,
    color: '#f5222d'
  }
]

// 步骤2：数据选择
const dateRange = ref([])
const trainingTypes = ref([])
const selectedSessions = ref([])
const sessionData = ref([])
const sessionColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    width: '20%'
  },
  {
    title: '训练类型',
    dataIndex: 'trainingType',
    width: '20%'
  },
  {
    title: '时长(分钟)',
    dataIndex: 'duration',
    width: '15%'
  },
  {
    title: '得分',
    dataIndex: 'score',
    width: '20%'
  },
  {
    title: '分析状态',
    dataIndex: 'status',
    width: '15%'
  }
]

// 步骤3：编辑内容
const reportTitle = ref('乒乓球训练分析报告')
const reportSummary = ref('')
const reportSections = ref([{ title: '', content: '' }])
const reportConclusion = ref('')
const reportSuggestions = ref('')

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

// 获取评分状态
const getScoreStatus = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'active'
  return 'exception'
}

// 在 script setup 部分添加
const selectionMode = ref('single')

// 全选所有会话
const selectAllSessions = () => {
  selectedSessions.value = sessionData.value.map(record => record.id)
}

// 修改会话选择变化处理函数
const onSessionSelectionChange = (selectedRowKeys) => {
  if (selectionMode.value === 'single') {
    // 单选模式下只保留最后选择的一个
    selectedSessions.value = selectedRowKeys.slice(-1)
  } else {
    // 多选模式下保持所有选择
    selectedSessions.value = selectedRowKeys
  }
}

// 添加章节
const addSection = () => {
  // 创建新章节对象
  const newSection = { title: '', content: '' };
  
  // 添加到数组
  reportSections.value.push(newSection);
  
  // 触发响应式更新
  reportSections.value = [...reportSections.value];
  
  console.log('添加章节后数量:', reportSections.value.length);
}

// 删除章节
const removeSection = (index) => {
  reportSections.value.splice(index, 1)
}

// 使用AI生成内容
const generateAiContent = async () => {
  // 请求前清空章节数据，避免空章节被发送
  reportSections.value = [];
  
  loading.value = true;
  message.loading({ content: '正在分析训练数据并生成内容...', key: 'aiContentLoading', duration: 0 });
  
  try {
    // 准备请求数据
    const requestData = {
      template: selectedTemplate.value,
      dateRange: dateRange.value ? dateRange.value.map(date => date.format('YYYY-MM-DD')) : null,
      trainingTypes: trainingTypes.value,
      sessions: selectedSessions.value,
      currentContent: {
        title: reportTitle.value,
        summary: reportSummary.value,
        sections: reportSections.value,
        conclusion: reportConclusion.value,
        suggestions: reportSuggestions.value
      }
    };
    
    console.log('发送请求数据:', requestData);
    
    const response = await getModelAnalysis(requestData);
    console.log('收到解析后数据:', response);
    
    // 修正数据访问路径，确保使用response.data
    if (response && response.code === 200 && response.data) {
      const data = response.data;
      console.log('解析响应数据:', data);
      
      // 直接更新Vue响应式变量
      if (data.title) reportTitle.value = data.title;
      if (data.summary) reportSummary.value = data.summary;
      
      // 确保sections是数组并且有内容
      if (data.sections && Array.isArray(data.sections) && data.sections.length > 0) {
        try {
          // 完全清空现有数组
          reportSections.value = [];
          
          // 创建新的深度响应式对象数组
          const processedSections = data.sections.map(section => ({
            title: section.title || '未命名章节',
            content: section.content || ''
          }));
          
          // 使用push添加每个元素，确保触发响应式更新
          processedSections.forEach(section => {
            reportSections.value.push(section);
          });
          
          // 调试日志
          console.log('更新后的章节数量:', reportSections.value.length);
          console.log('第一个章节标题:', reportSections.value[0]?.title);
          
          // 确保UI更新
          nextTick(() => {
            // 创建浅拷贝触发更新
            reportSections.value = [...reportSections.value];
            console.log('视图已更新，当前章节数:', reportSections.value.length);
          });
        } catch (error) {
          console.error('处理章节数据时出错:', error);
        }
      }
      
      // 处理结论和建议，确保响应式更新
      if (data.conclusion) {
        reportConclusion.value = data.conclusion;
        console.log('结论已更新:', reportConclusion.value.substring(0, 30) + '...');
      }
      
      if (data.suggestions) {
        reportSuggestions.value = data.suggestions;
        console.log('建议已更新:', reportSuggestions.value.substring(0, 30) + '...');
      }
      
      // 确保所有数据都更新完成后再通知用户
      nextTick(() => {
        message.success({ content: '内容生成成功！', key: 'aiContentLoading' });
        console.log('所有数据更新完成, 标题:', reportTitle.value);
      });
    } else {
      throw new Error('无效的响应数据格式');
    }
  } catch (error) {
    console.error('生成内容错误:', error);
    message.error({ 
      content: '生成内容出错: ' + (error.message || '未知错误'), 
      key: 'aiContentLoading' 
    });
  } finally {
    loading.value = false;
  }
}

// 格式化内容（将换行符转换为<br>标签）
const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

// 保存报告
const handleSaveReport = async () => {
  saveLoading.value = true
  
  try {
    // 准备要保存的报告数据
    const reportData = {
      title: reportTitle.value,
      summary: reportSummary.value,
      sections: reportSections.value,
      conclusion: reportConclusion.value,
      suggestions: reportSuggestions.value,
      template: selectedTemplate.value,
      dateRange: dateRange.value ? dateRange.value.map(date => date.format('YYYY-MM-DD')) : null,
      trainingTypes: trainingTypes.value,
      sessions: selectedSessions.value
    }
    
    // 调用API保存报告
    const response = await saveReport(reportData)
    
    if (response && response.code === 200) {
      message.success('报告保存成功！')
      // 存储报告ID以供后续使用
      if (response.data && response.data.id) {
        currentReportId.value = response.data.id
        console.log('已保存报告ID:', currentReportId.value)
      }
    } else {
      throw new Error(response?.message || '保存失败')
    }
  } catch (error) {
    console.error('保存报告错误:', error)
    message.error('保存报告失败: ' + (error.message || '未知错误'))
  } finally {
    saveLoading.value = false
  }
}

// 导出报告为PDF
const handleExportReport = async () => {
  exportLoading.value = true
  
  try {
    // 如果报告尚未保存，先保存报告
    let reportId
    if (!currentReportId.value) {
      // 准备要保存的报告数据
      const reportData = {
        title: reportTitle.value,
        summary: reportSummary.value,
        sections: reportSections.value,
        conclusion: reportConclusion.value,
        suggestions: reportSuggestions.value,
        template: selectedTemplate.value,
        dateRange: dateRange.value ? dateRange.value.map(date => date.format('YYYY-MM-DD')) : null,
        trainingTypes: trainingTypes.value,
        sessions: selectedSessions.value
      }
      
      // 先保存报告
      const saveResponse = await saveReport(reportData)
      
      if (saveResponse && saveResponse.code === 200) {
        message.success('报告已保存，准备导出...')
        reportId = saveResponse.data.id
        currentReportId.value = reportId
      } else {
        throw new Error(saveResponse?.message || '保存失败')
      }
    } else {
      reportId = currentReportId.value
    }
    
    // 使用API导出PDF
    const response = await exportReportPDF(reportId)
    
    // 创建Blob并下载
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportTitle.value || '训练报告'}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
    
    message.success('PDF导出成功！')
  } catch (error) {
    console.error('导出报告错误:', error)
    message.error('导出PDF失败: ' + (error.message || '未知错误'))
  } finally {
    exportLoading.value = false
  }
}

// 下一步
const next = () => {
  currentStep.value++
}

// 上一步
const prev = () => {
  currentStep.value--
}

// 获取训练会话数据
const fetchTrainingSessions = () => {
  loading.value = true
  
  // 这里应该调用API获取数据
  // 模拟数据
  setTimeout(() => {
    sessionData.value = Array(10).fill().map((_, index) => {
      const types = ['forehand', 'backhand', 'serve', 'footwork', 'match']
      const type = types[Math.floor(Math.random() * types.length)]
      const date = new Date()
      date.setDate(date.getDate() - index * 2)
      
      return {
        id: index + 1,
        date: formatDate(date, 'YYYY-MM-DD'),
        trainingType: type,
        duration: Math.floor(Math.random() * 60) + 30,
        score: Math.floor(Math.random() * 30) + 70,
        status: Math.random() > 0.3 ? '已分析' : '未分析'
      }
    })
    
    loading.value = false
  }, 1000)
}

// 章节标题更新辅助函数
const updateSectionTitle = (index, value) => {
  if (reportSections.value[index]) {
    reportSections.value[index].title = value;
    // 创建浅拷贝触发响应式更新
    reportSections.value = [...reportSections.value];
  }
};

// 章节内容更新辅助函数
const updateSectionContent = (index, value) => {
  if (reportSections.value[index]) {
    reportSections.value[index].content = value;
    // 创建浅拷贝触发响应式更新
    reportSections.value = [...reportSections.value];
  }
};

// 测试数据绑定函数
// const testDataBinding = () => {
//   reportSections.value = [
//     { title: '测试标题 ' + new Date().getSeconds(), content: '测试内容' }
//   ];
//   nextTick(() => {
//     console.log('测试数据已更新', reportSections.value);
//   });
// };

// 标题更新辅助函数
const updateReportTitle = (value) => {
  reportTitle.value = value;
  console.log('标题已更新:', reportTitle.value);
};

// 摘要更新辅助函数
const updateReportSummary = (value) => {
  reportSummary.value = value;
  console.log('摘要已更新:', reportSummary.value.substring(0, 20) + '...');
};

// 结论更新辅助函数
const updateReportConclusion = (value) => {
  reportConclusion.value = value;
  console.log('结论已更新:', reportConclusion.value.substring(0, 20) + '...');
};

// 建议更新辅助函数
const updateReportSuggestions = (value) => {
  reportSuggestions.value = value;
  console.log('建议已更新:', reportSuggestions.value.substring(0, 20) + '...');
};

onMounted(() => {
  fetchTrainingSessions()
})
</script>

<style scoped>
.training-report {
  padding: 16px;
}

.template-card {
  margin-bottom: 16px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.selected-template {
  border-color: #1890ff;
}

.template-icon-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  background: #f5f5f5;
  margin-bottom: 12px;
}

.template-icon {
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.template-card:hover .template-icon-container {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .template-icon-container {
    height: 120px;
  }
  
  .template-icon {
    width: 70%;
    height: 70%;
  }
}

.template-info h3 {
  margin-bottom: 8px;
}

.report-section {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 16px;
}

.report-container {
  background-color: white;
  padding: 40px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-header {
  text-align: center;
  margin-bottom: 24px;
}

.report-header h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.report-date {
  color: #888;
}

.report-summary,
.report-section-content,
.report-conclusion,
.report-suggestions {
  margin-bottom: 24px;
}

.report-summary h2,
.report-section-content h2,
.report-conclusion h2,
.report-suggestions h2 {
  font-size: 18px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

@media (max-width: 768px) {
  .report-container {
    padding: 20px;
  }
}
</style> 