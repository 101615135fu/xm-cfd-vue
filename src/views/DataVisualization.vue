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
          <!-- 添加公司选择器 -->
          <el-form-item label="公司">
            <el-select 
              v-model="filterForm.company" 
              placeholder="选择公司" 
              @change="handleCompanyChange"
              style="width: 280px;" 
              popper-class="company-select-dropdown"
            >
              <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button type="success" @click="generateData">生成示例数据</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <el-row :gutter="20">
      <!-- 饼图：按类别汇总 - 修改为使用年度财务数据 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">财务数据类别分布</h3>
            <div class="chart-controls">
              <span class="control-label">选择年份:</span>
              <el-select v-model="selectedYear" placeholder="选择年份" size="small" @change="updateSummaryChart" style="min-width: 120px;">
                <el-option 
                  v-for="year in availableYears" 
                  :key="year" 
                  :label="year" 
                  :value="year" 
                />
              </el-select>
            </div>
          </div>
          <pie-chart
            :chart-data="summaryChartData"
            :loading="loading.summary"
            height="350px"
            title=""
            :show-title="false"
          />
        </div>
      </el-col>
      
      <!-- 柱状图：月度对比 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="chart-card">
          <bar-chart
            :chart-data="monthlyChartData"
            title="年度财务数据对比"
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
    
    <!-- 修改股票数据可视化部分 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <div class="chart-card">
          <h2 class="section-title">股票行情数据</h2>
          <bar-chart
            :chart-data="stockChartData"
            title="主要股票价格与涨跌幅对比"
            :loading="stockLoading"
            height="450px"
          />
        </div>
      </el-col>
    </el-row>
    
    <!-- 股票详细数据表格 - 优化展示更多维度 -->
    <div class="data-table-container mt-20" v-if="stockData.length > 0">
      <h2 class="section-title">股票详细数据</h2>
      
      <!-- 股票价格与交易信息 -->
      <el-tabs type="border-card" class="stock-tabs">
        <el-tab-pane label="价格与交易信息">
          <el-table
            :data="stockData"
            style="width: 100%"
            v-loading="stockLoading"
            border
            stripe
          >
            <el-table-column prop="symbol" label="代码" width="80" fixed />
            <el-table-column prop="name" label="名称" width="180" fixed />
            <el-table-column prop="price" label="当前价格" width="100">
              <template #default="scope">
                {{ scope.row.price.toFixed(2) }} {{ scope.row.currency }}
              </template>
            </el-table-column>
            <el-table-column prop="change" label="涨跌额" width="100">
              <template #default="scope">
                <span :class="parseFloat(scope.row.change) > 0 ? 'text-success' : 'text-danger'">
                  {{ scope.row.change }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="changePercent" label="涨跌幅" width="100">
              <template #default="scope">
                <span :class="parseFloat(scope.row.changePercent) > 0 ? 'text-success' : 'text-danger'">
                  {{ scope.row.changePercent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="marketCap" label="市值" width="120" />
            <el-table-column prop="peRatio" label="市盈率" width="100" />
            <el-table-column prop="volume" label="成交量" width="120">
              <template #default="scope">
                {{ scope.row.volume.toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <!-- 财务指标 -->
        <el-tab-pane label="财务指标">
          <el-table
            :data="stockIndicators"
            style="width: 100%"
            v-loading="stockLoading"
            border
            stripe
          >
            <el-table-column prop="symbol" label="代码" width="80" fixed />
            <el-table-column prop="name" label="名称" width="180" fixed />
            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column prop="changePercent" label="涨跌幅" width="100">
              <template #default="scope">
                <span :class="parseFloat(scope.row.changePercent) > 0 ? 'text-success' : 'text-danger'">
                  {{ scope.row.changePercent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="pe" label="市盈率(TTM)" width="120" />
            <el-table-column prop="marketCap" label="市值" width="120" />
            <el-table-column prop="volume" label="成交量" width="120" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import { financialApi } from '@/utils/request'
import { getStockHistory, formatTimeSeriesData } from '@/services/financialDataService'
import { getIncomeStatement, getBalanceSheet, getCashFlowStatement, getFinancialRatios } from '@/services/fmpService'
import '@/styles/dataVisualization.css'

// 筛选表单
const filterForm = reactive({
  category: '',
  dateRange: [],
  company: 'AAPL' // 默认选择苹果公司
})

// 公司选项
const companyOptions = [
  { value: 'AAPL', label: 'Apple Inc. (苹果)' },
  { value: 'MSFT', label: 'Microsoft Corporation (微软)' },
  { value: 'GOOGL', label: 'Alphabet Inc. (谷歌)' },
  { value: 'AMZN', label: 'Amazon.com Inc. (亚马逊)' },
  { value: 'META', label: 'Meta Platforms Inc. (Meta)' },
  { value: 'TSLA', label: 'Tesla Inc. (特斯拉)' },
  { value: 'NVDA', label: 'NVIDIA Corporation (英伟达)' },
  { value: 'JPM', label: 'JPMorgan Chase & Co. (摩根大通)' }
]

// 添加缺失的变量定义
const selectedYear = ref('') // 选择的年份
const availableYears = ref([]) // 可用年份列表
const financialDataByYear = ref({}) // 按年份存储的财务数据

// 处理公司变更
const handleCompanyChange = () => {
  // 重置年份选择
  selectedYear.value = ''
  // 当公司变更时，重新获取财务数据
  fetchAllData()
}

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
  // 不再单独获取饼图数据，由fetchMonthlyData提供
  fetchMonthlyData() // 这个函数现在同时处理柱状图和饼图数据
  fetchTrendData()
  fetchTableData()
  fetchStockData()
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

// 更新饼图数据的函数
const updateSummaryChart = () => {
  if (selectedYear.value && financialDataByYear.value[selectedYear.value]) {
    summaryChartData.value = financialDataByYear.value[selectedYear.value]
    console.log('更新饼图数据:', selectedYear.value, summaryChartData.value)
  } else if (Object.keys(financialDataByYear.value).length > 0) {
    // 如果没有选择年份，使用最新的年份
    const latestYear = Object.keys(financialDataByYear.value).pop()
    selectedYear.value = latestYear
    summaryChartData.value = financialDataByYear.value[latestYear]
    console.log('使用最新年份更新饼图:', latestYear, summaryChartData.value)
  }
}

// 获取月度数据（柱状图）- 同时处理饼图数据
const fetchMonthlyData = async () => {
  loading.monthly = true
  loading.summary = true // 同时设置饼图加载状态
  try {
    // 使用选择的公司
    const symbol = filterForm.company
    
    // 获取多年的收入报表数据
    const incomeStatements = await getIncomeStatement(symbol, 'annual', 5)
    
    if (incomeStatements && incomeStatements.length > 0) {
      // 提取年度数据
      const years = incomeStatements.map(statement => {
        // 从日期中提取年份
        const date = new Date(statement.date)
        return date.getFullYear().toString()
      }).reverse() // 按时间顺序排列
      
      // 保存可用年份
      availableYears.value = years
      // 默认选择最新年份
      if (!selectedYear.value && years.length > 0) {
        selectedYear.value = years[years.length - 1]
      }
      
      // 提取收入、成本和利润数据
      const revenue = incomeStatements.map(statement => statement.revenue / 1000000).reverse() // 转换为百万
      const costOfRevenue = incomeStatements.map(statement => statement.costOfRevenue / 1000000).reverse()
      const grossProfit = incomeStatements.map(statement => statement.grossProfit / 1000000).reverse()
      const netIncome = incomeStatements.map(statement => statement.netIncome / 1000000).reverse()
      
      // 设置图表数据
      monthlyChartData.value = {
        xAxis: years,
        series: [
          {
            name: '营业收入',
            data: revenue
          },
          {
            name: '营业成本',
            data: costOfRevenue
          },
          {
            name: '毛利润',
            data: grossProfit
          },
          {
            name: '净利润',
            data: netIncome
          }
        ]
      }
      
      // 按年份整理财务数据，用于饼图
      financialDataByYear.value = {}
      years.forEach((year, index) => {
        financialDataByYear.value[year] = [
          { name: '营业收入', value: revenue[index] },
          { name: '营业成本', value: costOfRevenue[index] },
          { name: '毛利润', value: grossProfit[index] },
          { name: '净利润', value: netIncome[index] }
        ]
      })
      
      // 更新饼图数据
      updateSummaryChart()
      
      console.info('使用FMP API获取的收入报表数据')
    } else {
      throw new Error('未获取到收入报表数据')
    }
  } catch (error) {
    console.error('获取月度数据失败', error)
    ElMessage.error('获取月度数据失败，使用模拟数据')
    
    // 错误时使用模拟数据 - 修改为使用年份而非月份
    const years = ['2020', '2021', '2022', '2023', '2024']
    availableYears.value = years
    if (!selectedYear.value) {
      selectedYear.value = '2024'
    }
    
    const mockRevenue = [8000, 9200, 9500, 10700, 12000]
    const mockCost = [5000, 5500, 5700, 6000, 6500]
    const mockGrossProfit = [3000, 3700, 3800, 4700, 5500]
    const mockNetIncome = [2000, 2500, 2600, 3200, 3800]
    
    monthlyChartData.value = {
      xAxis: years,
      series: [
        {
          name: '营业收入',
          data: mockRevenue
        },
        {
          name: '营业成本',
          data: mockCost
        },
        {
          name: '毛利润',
          data: mockGrossProfit
        },
        {
          name: '净利润',
          data: mockNetIncome
        }
      ]
    }
    
    // 按年份整理模拟财务数据，用于饼图
    financialDataByYear.value = {}
    years.forEach((year, index) => {
      financialDataByYear.value[year] = [
        { name: '营业收入', value: mockRevenue[index] },
        { name: '营业成本', value: mockCost[index] },
        { name: '毛利润', value: mockGrossProfit[index] },
        { name: '净利润', value: mockNetIncome[index] }
      ]
    })
    
    // 更新饼图数据
    updateSummaryChart()
  } finally {
    loading.monthly = false
    loading.summary = false
  }
}

// 获取财务时间序列数据
const fetchTrendData = async () => {
  loading.trend = true;
  try {
    // 使用选择的公司
    const symbol = filterForm.company;
    
    // 获取财务比率数据
    const financialRatios = await getFinancialRatios(symbol, 'annual', 5);
    
    if (financialRatios && financialRatios.length > 0) {
      // 提取年度数据
      const years = financialRatios.map(ratio => {
        // 从日期中提取年份
        const date = new Date(ratio.date);
        return date.getFullYear().toString();
      }).reverse(); // 按时间顺序排列
      
      // 提取关键财务比率数据
      const peRatios = financialRatios.map(ratio => ratio.priceEarningsRatio || 0).reverse();
      const pbRatios = financialRatios.map(ratio => ratio.priceToBookRatio || 0).reverse();
      const roeRatios = financialRatios.map(ratio => ratio.returnOnEquity * 100 || 0).reverse(); // 转为百分比
      
      // 设置图表数据
      trendChartData.value = {
        xAxis: years,
        series: [
          {
            name: '市盈率(PE)',
            type: 'line',
            smooth: true,
            data: peRatios
          },
          {
            name: '市净率(PB)',
            type: 'line',
            smooth: true,
            data: pbRatios
          },
          {
            name: '股本回报率(ROE)%',
            type: 'line',
            smooth: true,
            data: roeRatios
          }
        ]
      };
      
      console.info('使用FMP API获取的财务比率数据');
    } else {
      throw new Error('未获取到财务比率数据');
    }
  } catch (error) {
    console.error('获取趋势数据失败', error);
    ElMessage.error('获取趋势数据失败，使用模拟数据');
    
    // 使用模拟数据
    const mockDates = [];
    const mockValues = [];
    
    // 生成过去12个月的模拟数据
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      mockDates.push(date.toISOString().slice(0, 10));
      // 生成随机值，150-250之间
      mockValues.push(Math.floor(Math.random() * 100) + 150);
    }
    
    trendChartData.value = {
      xAxis: mockDates,
      series: [
        {
          name: '股价趋势(模拟)',
          type: 'line',
          smooth: true,
          data: mockValues
        }
      ]
    };
  } finally {
    loading.trend = false;
  }
};

// 获取表格数据
const fetchTableData = async () => {
  loading.table = true
  try {
    // 使用选择的公司
    const symbol = filterForm.company;
    
    // 获取资产负债表数据
    const balanceSheet = await getBalanceSheet(symbol, 'annual', 5);
    
    if (balanceSheet && balanceSheet.length > 0) {
      // 转换数据为表格格式
      const formattedData = [];
      
      balanceSheet.forEach(statement => {
        // 从日期中提取年份
        const date = new Date(statement.date);
        const year = date.getFullYear().toString();
        
        // 添加资产数据
        formattedData.push({
          date: statement.date,
          category: '总资产',
          value: statement.totalAssets,
          description: `${year}年总资产`
        });
        
        // 添加负债数据
        formattedData.push({
          date: statement.date,
          category: '总负债',
          value: statement.totalLiabilities,
          description: `${year}年总负债`
        });
        
        // 添加股东权益数据
        formattedData.push({
          date: statement.date,
          category: '股东权益',
          value: statement.totalStockholdersEquity,
          description: `${year}年股东权益`
        });
        
        // 添加现金及现金等价物
        formattedData.push({
          date: statement.date,
          category: '现金及等价物',
          value: statement.cashAndCashEquivalents,
          description: `${year}年现金及等价物`
        });
      });
      
      tableData.value = formattedData.map(item => ({
        ...item,
        value: Number(item.value)
      }));
      
      pagination.total = tableData.value.length;
      
      // 客户端分页实现
      const start = (pagination.currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      tableData.value = tableData.value.slice(start, end);
      
      console.info('使用FMP API获取的资产负债表数据');
      return;
    } else {
      throw new Error('未获取到资产负债表数据');
    }
  } catch (error) {
    console.error('获取表格数据失败', error)
    ElMessage.error('获取表格数据失败，使用模拟数据')
    
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

// 添加股票数据相关状态
const stockData = ref([])
const stockLoading = ref(false)
const stockChartData = ref({ xAxis: [], series: [] })
const stockIndicators = ref([]) // 添加股票指标数据

// 获取股票数据 - 使用本地API
const fetchStockData = async () => {
  stockLoading.value = true
  try {
    // 使用本地API获取股票数据
    const response = await fetch('http://127.0.0.1:8000/api/stocks/quotes');
    const result = await response.json();
    
    if (result.data && result.data.length > 0) {
      stockData.value = result.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: (stock.price * stock.change_percent / 100).toFixed(2),
        changePercent: stock.change_percent.toFixed(2) + '%',
        marketCap: formatMarketCap(stock.market_cap),
        peRatio: stock.pe_ratio.toFixed(2),
        volume: stock.volume,
        currency: stock.currency
      }));
      
      // 准备股票指标数据
      stockIndicators.value = result.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        pe: stock.pe_ratio.toFixed(2),
        marketCap: formatMarketCap(stock.market_cap),
        volume: stock.volume.toLocaleString(),
        price: stock.price.toFixed(2),
        changePercent: stock.change_percent.toFixed(2) + '%'
      }));
      
      // 准备图表数据
      prepareStockChartData(stockData.value);
      
      console.info('使用本地API获取的股票数据', stockData.value);
    } else {
      throw new Error('未获取到股票数据');
    }
  } catch (error) {
    console.error('获取股票数据失败', error);
    ElMessage.error('获取股票数据失败，使用模拟数据');
    // 使用模拟数据
    useStockMockData();
  } finally {
    stockLoading.value = false;
  }
};

// 格式化市值显示
const formatMarketCap = (value) => {
  if (!value) return 'N/A';
  
  if (value >= 1000000000000) {
    return (value / 1000000000000).toFixed(2) + '万亿';
  } else if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + '十亿';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + '百万';
  } else {
    return value.toLocaleString();
  }
};

// 修改图表数据准备函数
const prepareStockChartData = (stocks) => {
  // 提取股票名称和价格数据
  const stockSymbols = stocks.map(stock => stock.symbol);
  const currentPrices = stocks.map(stock => stock.price);
  const changePercents = stocks.map(stock => parseFloat(stock.changePercent));
  
  // 设置股票数据图表 - 确保数据结构与BarChart组件期望的格式一致
  stockChartData.value = {
    xAxis: stockSymbols,
    series: [
      {
        name: '当前价格($)',
        data: currentPrices,
        type: 'bar'
      }
    ]
  };
  
  // 打印数据结构以便调试
  console.log('股票图表数据:', stockChartData.value);
};

// 使用模拟股票数据
const useStockMockData = () => {
  const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 202.09, changePercent: '-2.31%', marketCap: '3.02万亿', peRatio: '31.53', volume: 58857268, currency: 'USD' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 452.57, changePercent: '-1.22%', marketCap: '3.36万亿', peRatio: '35.03', volume: 18399615, currency: 'USD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.35, changePercent: '0.85%', marketCap: '2.21万亿', peRatio: '27.12', volume: 22563214, currency: 'USD' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.67, changePercent: '-0.45%', marketCap: '1.92万亿', peRatio: '42.78', volume: 31256987, currency: 'USD' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 512.45, changePercent: '1.23%', marketCap: '1.31万亿', peRatio: '29.45', volume: 15698745, currency: 'USD' }
  ];
  
  stockData.value = mockStocks;
  stockIndicators.value = mockStocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    pe: stock.peRatio,
    marketCap: stock.marketCap,
    volume: parseInt(stock.volume).toLocaleString(),
    price: stock.price.toFixed(2),
    changePercent: stock.changePercent
  }));
  
  prepareStockChartData(mockStocks);
};
onMounted(() => {
  fetchAllData()
})
</script>

