<template>
  <div class="data-visualization">
    <div class="page-header">
      <h1 class="page-title">财务数据可视化</h1>
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="类别">
            <el-select v-model="filterForm.category" placeholder="选择类别" clearable>
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button type="success" @click="generateData">生成示例数据</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <el-row :gutter="20">
      <!-- 饼图：按类别汇总 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chart-card">
          <pie-chart
            :chart-data="summaryChartData"
            title="财务数据类别分布"
            :loading="loading.summary"
            height="350px"
          />
        </div>
      </el-col>
      
      <!-- 柱状图：月度对比 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chart-card">
          <bar-chart
            :chart-data="monthlyChartData"
            title="月度财务数据对比"
            :loading="loading.monthly"
            height="350px"
          />
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="mt-20">
      <!-- 折线图：时间趋势 -->
      <el-col :span="24">
        <div class="chart-card">
          <line-chart
            :chart-data="trendChartData"
            title="财务数据时间趋势"
            :loading="loading.trend"
            height="400px"
          />
        </div>
      </el-col>
    </el-row>
    
    <!-- 数据表格 -->
    <div class="data-table-container mt-20">
      <h2 class="section-title">详细数据</h2>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading.table"
        border
        stripe
      >
        <el-table-column prop="date" label="日期" sortable />
        <el-table-column prop="category" label="类别" sortable />
        <el-table-column prop="value" label="金额" sortable>
          <template #default="scope">
            {{ scope.row.value.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import { financialApi } from '../utils/api'

// 筛选表单
const filterForm = reactive({
  category: '',
  dateRange: []
})

// 分类选项
const categoryOptions = [
  { value: '收入', label: '收入' },
  { value: '支出', label: '支出' },
  { value: '投资', label: '投资' },
  { value: '储蓄', label: '储蓄' }
]

// 数据加载状态
const loading = reactive({
  summary: false,
  monthly: false,
  trend: false,
  table: false
})

// 图表数据
const summaryChartData = ref([])
const monthlyChartData = ref({ xAxis: [], series: [] })
const trendChartData = ref({ xAxis: [], series: [] })

// 表格数据
const tableData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 处理分页变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchTableData()
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchTableData()
}

// 处理筛选
const handleFilter = () => {
  fetchAllData()
}

// 生成示例数据
const generateData = async () => {
  try {
    await ElMessageBox.confirm(
      '这将清空现有数据并生成新的示例数据，确定继续吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await financialApi.generateSampleData()
    ElMessage.success(result.message || '示例数据生成成功')
    
    // 刷新数据
    fetchAllData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('生成示例数据失败', error)
      ElMessage.error('生成示例数据失败')
    }
  }
}

// 获取所有图表数据
const fetchAllData = () => {
  fetchSummaryData()
  fetchMonthlyData()
  fetchTrendData()
  fetchTableData()
}

// 构建查询参数
const buildQueryParams = () => {
  const params = {}
  
  if (filterForm.category) {
    params.category = filterForm.category
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    params.start_date = filterForm.dateRange[0]
    params.end_date = filterForm.dateRange[1]
  }
  
  return params
}

// 获取汇总数据（饼图）
const fetchSummaryData = async () => {
  loading.summary = true
  try {
    const params = buildQueryParams()
    const data = await financialApi.getFinancialSummary(params)
    
    // 检查数据是否为空
    if (!data || data.length === 0) {
      // 使用模拟数据
      summaryChartData.value = [
        { name: '收入', value: 45000 },
        { name: '支出', value: 28000 },
        { name: '投资', value: 15000 },
        { name: '储蓄', value: 12000 }
      ]
      console.info('使用饼图模拟数据')
    } else {
      summaryChartData.value = data.map(item => ({
        name: item.category,
        value: item.total
      }))
    }
  } catch (error) {
    console.error('获取汇总数据失败', error)
    ElMessage.error('获取汇总数据失败')
    
    // 错误时也使用模拟数据
    summaryChartData.value = [
      { name: '收入', value: 45000 },
      { name: '支出', value: 28000 },
      { name: '投资', value: 15000 },
      { name: '储蓄', value: 12000 }
    ]
  } finally {
    loading.summary = false
  }
}

// 获取月度数据（柱状图）
const fetchMonthlyData = async () => {
  loading.monthly = true
  try {
    const params = buildQueryParams()
    const data = await financialApi.getTimeSeriesData(params)
    
    // 检查数据是否为空
    if (!data || data.length === 0) {
      // 使用模拟数据
      const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06']
      monthlyChartData.value = {
        xAxis: months,
        series: [
          {
            name: '收入',
            data: [8000, 9200, 9500, 8700, 10000, 11500]
          },
          {
            name: '支出',
            data: [5000, 5500, 5700, 6000, 5800, 6200]
          },
          {
            name: '投资',
            data: [3000, 2800, 3200, 3500, 3800, 4000]
          }
        ]
      }
      console.info('使用柱状图模拟数据')
      return
    }
    
    // 按月份分组数据
    const monthlyData = {}
    const categories = new Set()
    
    data.forEach(item => {
      const date = new Date(item.date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[month]) {
        monthlyData[month] = {}
      }
      
      categories.add(item.category)
      
      if (!monthlyData[month][item.category]) {
        monthlyData[month][item.category] = 0
      }
      
      monthlyData[month][item.category] += Number(item.value)
    })
    
    // 转换为图表数据
    const months = Object.keys(monthlyData).sort()
    const categoriesArray = Array.from(categories)
    
    const series = categoriesArray.map(category => {
      return {
        name: category,
        data: months.map(month => monthlyData[month][category] || 0)
      }
    })
    
    monthlyChartData.value = {
      xAxis: months,
      series: series
    }
  } catch (error) {
    console.error('获取月度数据失败', error)
    ElMessage.error('获取月度数据失败')
    
    // 错误时使用模拟数据
    const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06']
    monthlyChartData.value = {
      xAxis: months,
      series: [
        {
          name: '收入',
          data: [8000, 9200, 9500, 8700, 10000, 11500]
        },
        {
          name: '支出',
          data: [5000, 5500, 5700, 6000, 5800, 6200]
        },
        {
          name: '投资',
          data: [3000, 2800, 3200, 3500, 3800, 4000]
        }
      ]
    }
  } finally {
    loading.monthly = false
  }
}

// 获取趋势数据（折线图）
const fetchTrendData = async () => {
  loading.trend = true
  try {
    const params = buildQueryParams()
    const data = await financialApi.getTimeSeriesData(params)
    
    // 检查数据是否为空
    if (!data || data.length === 0) {
      // 使用模拟数据
      const dates = ['2025-01-01', '2025-02-01', '2025-03-01', '2025-04-01', '2025-05-01', '2025-06-01']
      trendChartData.value = {
        xAxis: dates,
        series: [
          {
            name: '收入',
            type: 'line',
            smooth: true,
            data: [8000, 9200, 9500, 8700, 10000, 11500]
          },
          {
            name: '支出',
            type: 'line',
            smooth: true,
            data: [5000, 5500, 5700, 6000, 5800, 6200]
          },
          {
            name: '投资',
            type: 'line',
            smooth: true,
            data: [3000, 2800, 3200, 3500, 3800, 4000]
          }
        ]
      }
      console.info('使用折线图模拟数据')
      return
    }
    
    // 按日期排序
    data.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // 按类别分组数据
    const categoryData = {}
    data.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = []
      }
      
      categoryData[item.category].push({
        date: item.date,
        value: Number(item.value)
      })
    })
    
    // 获取所有唯一日期
    const allDates = [...new Set(data.map(item => item.date))].sort()
    
    // 转换为图表数据
    const series = Object.keys(categoryData).map(category => {
      const categoryValues = {}
      categoryData[category].forEach(item => {
        categoryValues[item.date] = item.value
      })
      
      return {
        name: category,
        type: 'line',
        smooth: true,
        data: allDates.map(date => categoryValues[date] || null)
      }
    })
    
    trendChartData.value = {
      xAxis: allDates,
      series: series
    }
  } catch (error) {
    console.error('获取趋势数据失败', error)
    ElMessage.error('获取趋势数据失败')
    
    // 错误时使用模拟数据
    const dates = ['2025-01-01', '2025-02-01', '2025-03-01', '2025-04-01', '2025-05-01', '2025-06-01']
    trendChartData.value = {
      xAxis: dates,
      series: [
        {
          name: '收入',
          type: 'line',
          smooth: true,
          data: [8000, 9200, 9500, 8700, 10000, 11500]
        },
        {
          name: '支出',
          type: 'line',
          smooth: true,
          data: [5000, 5500, 5700, 6000, 5800, 6200]
        },
        {
          name: '投资',
          type: 'line',
          smooth: true,
          data: [3000, 2800, 3200, 3500, 3800, 4000]
        }
      ]
    }
  } finally {
    loading.trend = false
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.table = true
  try {
    const params = {
      ...buildQueryParams()
    }
    
    const data = await financialApi.getFinancialData(params)
    
    // 检查数据是否为空
    if (!data || data.length === 0) {
      // 使用模拟数据
      const mockData = [
        { date: '2025-01-15', category: '收入', value: 8500, description: '工资收入' },
        { date: '2025-01-20', category: '支出', value: 2000, description: '房租' },
        { date: '2025-02-01', category: '投资', value: 3000, description: '股票投资' },
        { date: '2025-02-15', category: '收入', value: 9000, description: '工资收入' },
        { date: '2025-02-25', category: '支出', value: 1500, description: '生活用品' },
        { date: '2025-03-01', category: '储蓄', value: 2000, description: '定期存款' },
        { date: '2025-03-15', category: '收入', value: 9200, description: '工资收入' },
        { date: '2025-03-20', category: '支出', value: 2200, description: '餐饮' },
        { date: '2025-04-01', category: '投资', value: 3500, description: '基金投资' },
        { date: '2025-04-15', category: '收入', value: 9500, description: '工资收入' }
      ]
      
      tableData.value = mockData.map(item => ({
        ...item,
        value: Number(item.value)
      }))
      
      pagination.total = mockData.length
      
      // 客户端分页实现
      const start = (pagination.currentPage - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      tableData.value = tableData.value.slice(start, end)
      
      console.info('使用表格模拟数据')
      return
    }
    
    tableData.value = data.map(item => ({
      ...item,
      value: Number(item.value)
    }))
    
    pagination.total = tableData.value.length
    
    // 客户端分页实现
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = tableData.value.slice(start, end)
    
    console.info('使用表格模拟数据')
    return
  } catch (error) {
    console.error('获取表格数据失败', error)
    ElMessage.error('获取表格数据失败')
    
    // 错误时使用模拟数据
    const mockData = [
      { date: '2025-01-15', category: '收入', value: 8500, description: '工资收入' },
      { date: '2025-01-20', category: '支出', value: 2000, description: '房租' },
      { date: '2025-02-01', category: '投资', value: 3000, description: '股票投资' },
      { date: '2025-02-15', category: '收入', value: 9000, description: '工资收入' },
      { date: '2025-02-25', category: '支出', value: 1500, description: '生活用品' }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } finally {
    loading.table = false
  }
}

onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
@import '../assets/theme.css';

.data-visualization {
  padding: var(--spacing-lg);
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-title {
  color: var(--text-color);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.filter-container {
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
}

.chart-card {
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.section-title {
  font-size: var(--font-size-lg);
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
}

.data-table-container {
  background-color: var(--background-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.pagination-container {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
}

.mt-20 {
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .data-visualization {
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .filter-form {
    display: flex;
    flex-direction: column;
  }
  
  .filter-form .el-form-item {
    margin-right: 0;
    margin-bottom: var(--spacing-sm);
  }
}
</style>