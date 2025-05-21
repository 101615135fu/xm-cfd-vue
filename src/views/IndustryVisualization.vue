<template>
  <div class="industry-visualization">
    <div class="page-header">
      <h1 class="page-title">行业数据可视化</h1>
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="行业">
            <el-select 
              v-model="filterForm.industry" 
              placeholder="选择行业" 
              @change="handleIndustryChange"
              style="width: 280px;" 
              popper-class="industry-select-dropdown"
            >
              <el-option v-for="item in industryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchIndustryData">查询</el-button>
            <el-button type="success" @click="exportData">导出数据</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 市场规模卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="market-size-card">
          <div class="card-header">
            <h2>{{ currentIndustryLabel }}市场规模</h2>
          </div>
          <div class="card-body" v-loading="loading.marketSize">
            <div class="market-size-value">{{ marketSize }}</div>
            <div class="market-size-description">预计年增长率: {{ growthRate }}%</div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="mt-20">
      <!-- 顶级公司收入图表 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chart-card">
          <h3 class="chart-title">顶级公司收入分布</h3>
          <bar-chart
            :chart-data="topCompaniesChartData"
            :loading="loading.topCompanies"
            height="350px"
            title=""
            :show-title="false"
            :horizontal="true"
          />
        </div>
      </el-col>
      
      <!-- 增长最快的公司 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chart-card">
          <h3 class="chart-title">增长最快的公司</h3>
          <pie-chart
            :chart-data="fastestGrowingChartData"
            :loading="loading.fastestGrowing"
            height="350px"
            title=""
            :show-title="false"
          />
        </div>
      </el-col>
    </el-row>
    
    <!-- 数据表格 - 顶级公司 -->
    <div class="data-table-container mt-20">
      <h2 class="section-title">顶级公司详细数据</h2>
      <el-table
        :data="topCompaniesData"
        style="width: 100%"
        v-loading="loading.topCompanies"
        border
        stripe
      >
        <el-table-column prop="name" label="公司名称" sortable />
        <el-table-column prop="revenue" label="收入" sortable>
          <template #default="scope">
            {{ formatRevenue(scope.row.revenue) }}
          </template>
        </el-table-column>
        <el-table-column prop="marketShare" label="市场份额" sortable>
          <template #default="scope">
            {{ calculateMarketShare(scope.row.revenue) }}%
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 数据表格 - 增长最快的公司 -->
    <div class="data-table-container mt-20">
      <h2 class="section-title">增长最快的公司</h2>
      <el-table
        :data="fastestGrowingData"
        style="width: 100%"
        v-loading="loading.fastestGrowing"
        border
        stripe
      >
        <el-table-column prop="name" label="公司名称" sortable />
        <el-table-column prop="founded" label="成立年份" sortable />
        <el-table-column prop="age" label="公司年龄" sortable>
          <template #default="scope">
            {{ calculateCompanyAge(scope.row.founded) }}年
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 行业趋势图 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <div class="chart-card">
          <h3 class="chart-title">{{ currentIndustryLabel }}行业趋势</h3>
          <line-chart
            :chart-data="industryTrendChartData"
            :loading="loading.trend"
            height="400px"
            title=""
            :show-title="false"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import axios from 'axios'

// 筛选表单
const filterForm = reactive({
  industry: 'Fintech' // 默认选择金融科技
})

// 行业选项
const industryOptions = [
  { value: 'Fintech', label: '金融科技 (Fintech)' },
  { value: 'HealthTech', label: '健康科技 (HealthTech)' },
  { value: 'EdTech', label: '教育科技 (EdTech)' },
  { value: 'E-commerce', label: '电子商务 (E-commerce)' },
  { value: 'Greentech', label: '绿色科技 (Greentech)' }
]

// 获取当前选择的行业标签
const currentIndustryLabel = computed(() => {
  const industry = industryOptions.find(item => item.value === filterForm.industry)
  return industry ? industry.label : ''
})

// 数据加载状态
const loading = reactive({
  marketSize: false,
  topCompanies: false,
  fastestGrowing: false,
  trend: false
})

// 市场规模数据
const marketSize = ref('0')
const growthRate = ref('0')

// 顶级公司数据
const topCompaniesData = ref([])
const topCompaniesChartData = ref({ xAxis: [], series: [] })

// 增长最快的公司数据
const fastestGrowingData = ref([])
const fastestGrowingChartData = ref([])

// 行业趋势数据
const industryTrendChartData = ref({ xAxis: [], series: [] })

// 处理行业变更
const handleIndustryChange = () => {
  fetchIndustryData()
}

// 获取行业数据
const fetchIndustryData = async () => {
  // 设置所有加载状态为true
  Object.keys(loading).forEach(key => {
    loading[key] = true
  })
  
  try {
    const industry = filterForm.industry
    const response = await axios.get(`http://127.0.0.1:8000/api/industry_summary_api/${industry}`)
    const data = response.data
    
    // 处理市场规模数据
    marketSize.value = data.market_size || '未知'
    // 生成随机增长率 (实际应用中应该从API获取)
    growthRate.value = (Math.random() * 20 + 5).toFixed(1)
    
    // 处理顶级公司数据
    if (data.top_companies && data.top_companies.length > 0) {
    // 处理API返回的收入数据，转换单位
    const processedCompanies = data.top_companies.map(company => {
    let revenue = company.revenue;
    // 如果收入是字符串且包含单位
    if (typeof revenue === 'string') {
    if (revenue.endsWith('M') || revenue.endsWith('m')) {
    // 百万单位，直接转换为数字
    revenue = parseFloat(revenue.slice(0, -1));
    } else if (revenue.endsWith('B') || revenue.endsWith('b')) {
    // 十亿单位，转换为百万
    revenue = parseFloat(revenue.slice(0, -1)) * 1000;
    } else {
    // 尝试直接解析为数字
    revenue = parseFloat(revenue) || 0;
    }
    }
    return {
    ...company,
    revenue: revenue,
    displayRevenue: revenue // 保存处理后的收入值
    };
    });
    
    // 按收入排序
    processedCompanies.sort((a, b) => b.revenue - a.revenue);
    
    topCompaniesData.value = processedCompanies;
    
    // 准备图表数据 - 横向柱状图需要调整数据结构
    const companyNames = processedCompanies.map(company => company.name);
    const companyRevenues = processedCompanies.map(company => company.revenue);
    
    topCompaniesChartData.value = {
    yAxis: companyNames, // 横向柱状图y轴是类目轴
    series: [
    {
    // 移除name属性，不显示图例
    data: companyRevenues,
    type: 'bar',
    }
    ],
    xAxis: {
    name: '收入(百万美元)'
    },
    legend: {
    show: false // 显式隐藏图例
    }
    };
    } else {
    // 使用模拟数据
    useTopCompaniesMockData();
    }
    
    // 处理增长最快的公司数据
    if (data.fastest_growing && data.fastest_growing.length > 0) {
      fastestGrowingData.value = data.fastest_growing
      
      // 准备饼图数据
      fastestGrowingChartData.value = data.fastest_growing.map(company => ({
        name: company.name,
        value: calculateCompanyAge(company.founded)
      }))
    } else {
      // 使用模拟数据
      useFastestGrowingMockData()
    }
    
    // 生成行业趋势数据 (模拟数据，实际应用中应该从API获取)
    generateIndustryTrendData()
    
  } catch (error) {
    console.error('获取行业数据失败', error)
    ElMessage.error('获取行业数据失败，使用模拟数据')
    
    // 使用模拟数据
    useAllMockData()
  } finally {
    // 设置所有加载状态为false
    Object.keys(loading).forEach(key => {
      loading[key] = false
    })
  }
}

// 使用所有模拟数据
const useAllMockData = () => {
  // 市场规模模拟数据
  marketSize.value = `${(Math.random() * 500 + 100).toFixed(1)}亿美元`
  growthRate.value = (Math.random() * 20 + 5).toFixed(1)
  
  // 使用顶级公司模拟数据
  useTopCompaniesMockData()
  
  // 使用增长最快的公司模拟数据
  useFastestGrowingMockData()
  
  // 生成行业趋势数据
  generateIndustryTrendData()
}

// 使用顶级公司模拟数据
const useTopCompaniesMockData = () => {
  const mockData = []
  const companyPrefixes = {
    'Fintech': ['Pay', 'Bank', 'Fin', 'Money', 'Cash'],
    'HealthTech': ['Health', 'Med', 'Care', 'Life', 'Bio'],
    'EdTech': ['Learn', 'Edu', 'Teach', 'School', 'Study'],
    'E-commerce': ['Shop', 'Buy', 'Market', 'Store', 'Trade'],
    'Greentech': ['Eco', 'Green', 'Solar', 'Earth', 'Clean']
  }
  
  const prefixes = companyPrefixes[filterForm.industry] || ['Tech', 'Smart', 'AI', 'Digital', 'Future']
  
  for (let i = 0; i < 5; i++) {
    const prefix = prefixes[i % prefixes.length]
    // 直接使用百万为单位
    const revenue = Math.floor(Math.random() * 10000 + 1000)
    mockData.push({
      name: `${prefix}${['Tech', 'Group', 'Solutions', 'Systems', 'Corp'][i % 5]}`,
      revenue: revenue
    })
  }
  
  // 按收入排序
  mockData.sort((a, b) => b.revenue - a.revenue)
  
  topCompaniesData.value = mockData
  
  // 准备图表数据 - 横向柱状图
  const companyNames = mockData.map(company => company.name)
  const companyRevenues = mockData.map(company => company.revenue)
  
  topCompaniesChartData.value = {
    yAxis: companyNames,
    series: [
      {
        // 移除name属性，不显示图例
        data: companyRevenues,
        type: 'bar',
      }
    ],
    xAxis: {
      name: '收入(百万美元)'
    },
    legend: {
      show: false
    }
  }
}

// 使用增长最快的公司模拟数据
const useFastestGrowingMockData = () => {
  const mockData = []
  const companyPrefixes = {
    'Fintech': ['Quick', 'Rapid', 'Fast', 'Swift', 'Rocket'],
    'HealthTech': ['Vital', 'Pulse', 'Cure', 'Heal', 'Wellness'],
    'EdTech': ['Bright', 'Smart', 'Genius', 'Mind', 'Brain'],
    'E-commerce': ['Click', 'Cart', 'Basket', 'Web', 'Online'],
    'Greentech': ['Leaf', 'Wind', 'Sun', 'Eco', 'Nature']
  }
  
  const prefixes = companyPrefixes[filterForm.industry] || ['Grow', 'Rise', 'Boost', 'Surge', 'Jump']
  const currentYear = new Date().getFullYear()
  
  for (let i = 0; i < 5; i++) {
    const prefix = prefixes[i % prefixes.length]
    const founded = currentYear - Math.floor(Math.random() * 10 + 1) // 1-10年前成立
    mockData.push({
      name: `${prefix}${['Startup', 'Ventures', 'Innovation', 'Labs', 'AI'][i % 5]}`,
      founded: founded
    })
  }
  
  // 按成立年份排序（最新的在前）
  mockData.sort((a, b) => b.founded - a.founded)
  
  fastestGrowingData.value = mockData
  
  // 准备饼图数据
  fastestGrowingChartData.value = mockData.map(company => ({
    name: company.name,
    value: calculateCompanyAge(company.founded)
  }))
}

// 生成行业趋势数据
const generateIndustryTrendData = () => {
  const years = []
  const marketSizeData = []
  const growthRateData = []
  
  const currentYear = new Date().getFullYear()
  const baseSize = Math.random() * 100 + 50 // 基础市场规模（单位：十亿）
  let size = baseSize
  
  // 生成过去5年的数据
  for (let i = 0; i < 5; i++) {
    const year = currentYear - 4 + i
    years.push(year.toString())
    
    // 每年增长10-30%
    const growthRate = Math.random() * 20 + 10
    marketSizeData.push(size.toFixed(1))
    growthRateData.push(growthRate.toFixed(1))
    
    // 计算下一年的市场规模
    size = size * (1 + growthRate / 100)
  }
  
  // 设置图表数据
  industryTrendChartData.value = {
    xAxis: years,
    series: [
      {
        name: '市场规模(十亿美元)',
        type: 'bar',
        data: marketSizeData
      },
      {
        name: '增长率(%)',
        type: 'line',
        yAxisIndex: 1,
        data: growthRateData
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '规模',
        position: 'left'
      },
      {
        type: 'value',
        name: '增长率(%)',
        position: 'right'
      }
    ]
  }
}

// 格式化收入
const formatRevenue = (revenue) => {
  if (!revenue && revenue !== 0) return '0';
  
  // 已经是百万单位
  return `${revenue.toFixed(2)}百万美元`;
}

// 计算市场份额
const calculateMarketShare = (revenue) => {
  const totalRevenue = topCompaniesData.value.reduce((sum, company) => sum + company.revenue, 0)
  if (totalRevenue === 0) return '0'
  
  return ((revenue / totalRevenue) * 100).toFixed(2)
}

// 计算公司年龄
const calculateCompanyAge = (founded) => {
  if (!founded) return 0
  const currentYear = new Date().getFullYear()
  return currentYear - founded
}

// 导出数据
const exportData = () => {
  ElMessageBox.confirm(
    '确定要导出当前行业数据吗？',
    '导出确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 这里可以实现导出逻辑，例如生成CSV文件
    ElMessage.success('数据导出成功')
  }).catch(() => {
    // 取消导出
  })
}

onMounted(() => {
  fetchIndustryData()
})
</script>

<style scoped>
.industry-visualization {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #303133;
}

.filter-container {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.market-size-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 20px;
  color: #303133;
  margin: 0;
}

.market-size-value {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.market-size-description {
  font-size: 16px;
  color: #606266;
}

.chart-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.chart-title {
  font-size: 18px;
  color: #303133;
  margin-top: 0;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  color: #303133;
  margin-bottom: 16px;
}

.data-table-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.text-success {
  color: #67C23A;
}

.text-danger {
  color: #F56C6C;
}

@media (max-width: 768px) {
  .industry-visualization {
    padding: 10px;
  }
  
  .filter-form {
    display: flex;
    flex-direction: column;
  }
  
  .filter-form .el-form-item {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .market-size-value {
    font-size: 28px;
  }
}
</style>