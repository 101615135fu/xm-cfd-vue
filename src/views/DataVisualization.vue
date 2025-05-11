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
            title="主要股票价格对比"
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
            <el-table-column prop="shortName" label="名称" width="150" fixed>
              <template #default="scope">
                {{ scope.row.shortName || scope.row.displayName || scope.row.symbol }}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="当前价格" width="100">
              <template #default="scope">
                {{ scope.row.price || scope.row.regularMarketPrice?.toFixed(2) || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column prop="change" label="涨跌额" width="100">
              <template #default="scope">
                <span :class="parseFloat(scope.row.change || 0) > 0 ? 'text-success' : 'text-danger'">
                  {{ scope.row.change || 'N/A' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="changePercent" label="涨跌幅" width="100">
              <template #default="scope">
                <span :class="parseFloat(scope.row.changePercent || scope.row['change percent'] || 0) > 0 ? 'text-success' : 'text-danger'">
                  {{ scope.row.changePercent || scope.row['change percent'] || 'N/A' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="日内范围" width="150">
              <template #default="scope">
                {{ `${scope.row.low || 'N/A'} - ${scope.row.high || 'N/A'}` }}
              </template>
            </el-table-column>
            <el-table-column prop="volume" label="成交量" width="120">
              <template #default="scope">
                {{ parseInt(scope.row.volume || 0)?.toLocaleString() || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
              <template #default="scope">
                {{ scope.row['latest trading day'] || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column label="开盘价" width="100">
              <template #default="scope">
                {{ scope.row.open || 'N/A' }}
              </template>
            </el-table-column>
            <el-table-column label="昨收价" width="100">
              <template #default="scope">
                {{ scope.row['previous close'] || 'N/A' }}
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
            <el-table-column prop="name" label="名称" width="150" fixed />
            <el-table-column prop="pe" label="市盈率(TTM)" width="120" />
            <el-table-column prop="forwardPE" label="预期市盈率" width="120" />
            <el-table-column prop="eps" label="每股收益" width="120" />
            <el-table-column prop="dividend" label="股息率" width="100" />
            <el-table-column prop="fiftyTwoWeekRange" label="52周范围" width="150" />
            <el-table-column prop="averageVolume" label="3个月平均成交量" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import { financialApi } from '@/utils/request'
import { getStockHistory, formatTimeSeriesData } from '@/services/financialDataService'
import { getIncomeStatement, getBalanceSheet, getCashFlowStatement, getFinancialRatios } from '@/services/fmpService'

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

// 处理公司变更
const handleCompanyChange = () => {
  // 当公司变更时，重新获取财务数据
  fetchSummaryData()
  fetchMonthlyData()
  fetchTrendData()
  fetchTableData()
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
  fetchSummaryData()
  fetchMonthlyData()
  fetchTrendData()
  fetchTableData()
  fetchStockData() // 添加股票数据获取
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
    // 使用选择的公司
    const symbol = filterForm.company
    
    // 获取资产负债表数据
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
      
      console.info('使用FMP API获取的收入报表数据')
    } else {
      throw new Error('未获取到收入报表数据')
    }
  } catch (error) {
    console.error('获取月度数据失败', error)
    ElMessage.error('获取月度数据失败，使用模拟数据')
    
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

// 获取股票数据 - 使用真实API
const fetchStockData = async () => {
  stockLoading.value = true
  try {
    // 扩展股票列表，添加更多知名公司
    const symbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 
      'TSLA', 'NVDA', 'JPM', 'V', 'WMT', 
      'JNJ', 'PG', 'BABA', 'TSM', 'ORCL'
    ];
    const apiKey = 'BR3MCQ268E2X7TR9';
    
    const stocksData = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        );
        const data = await response.json();
        
        // 检查是否有Global Quote数据
        if (data['Global Quote']) {
          // 直接返回API返回的数据结构，保留原始字段名
          return {
            symbol: data['Global Quote']['01. symbol'],
            open: data['Global Quote']['02. open'],
            high: data['Global Quote']['03. high'],
            low: data['Global Quote']['04. low'],
            price: data['Global Quote']['05. price'],
            volume: data['Global Quote']['06. volume'],
            'latest trading day': data['Global Quote']['07. latest trading day'],
            'previous close': data['Global Quote']['08. previous close'],
            change: data['Global Quote']['09. change'],
            'change percent': data['Global Quote']['10. change percent'],
            // 添加一些额外字段用于显示
            shortName: symbol, // 可以添加公司名称映射
            displayName: getCompanyName(symbol)
          };
        } else {
          // 处理API错误或限制
          console.warn(`无法获取${symbol}的数据，可能达到API调用限制`);
          return {
            symbol: symbol,
            shortName: symbol,
            displayName: getCompanyName(symbol),
            price: 'N/A',
            change: 'N/A',
            'change percent': 'N/A'
          };
        }
      })
    );
    
    stockData.value = stocksData;
    prepareStockChartData(stocksData);
    
  } catch (error) {
    console.error('获取股票数据失败', error);
    ElMessage.error('获取股票数据失败，请检查API配置');
    // 暂时使用模拟数据
    useStockMockData();
  } finally {
    stockLoading.value = false;
  }
};

// 添加公司名称映射函数
const getCompanyName = (symbol) => {
  const companyNames = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'JPM': 'JPMorgan Chase & Co.',
    'V': 'Visa Inc.',
    'WMT': 'Walmart Inc.',
    'JNJ': 'Johnson & Johnson',
    'PG': 'Procter & Gamble Co.',
    'BABA': 'Alibaba Group Holding Ltd.',
    'TSM': 'Taiwan Semiconductor Manufacturing Co.',
    'ORCL': 'Oracle Corporation'
  };
  
  return companyNames[symbol] || symbol;
};

// 修改图表数据准备函数，适应新的数据结构
const prepareStockChartData = (stocks) => {
  // 提取股票名称和多个关键指标
  const stockNames = stocks.map(stock => stock.shortName || stock.displayName || stock.symbol);
  const currentPrices = stocks.map(stock => parseFloat(stock.price || 0) || 0);
  const dayChanges = stocks.map(stock => {
    const changePercent = stock['change percent'];
    if (!changePercent) return 0;
    // 移除百分号并转换为数字
    return parseFloat(changePercent.replace('%', '')) || 0;
  });
  
  // 设置多维度股票数据图表
  stockChartData.value = {
    xAxis: stockNames,
    series: [
      {
        name: '当前价格($)',
        data: currentPrices,
        type: 'bar'
      },
      {
        name: '日涨跌幅(%)',
        data: dayChanges,
        type: 'line',
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: function(params) {
            return params.value >= 0 ? '#67C23A' : '#F56C6C';
          }
        }
      }
    ],
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    }
  };
};

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

/* 添加股票数据相关样式 */
.text-success {
  color: #67C23A;
  font-weight: bold;
}

.text-danger {
  color: #F56C6C;
  font-weight: bold;
}

.stock-tabs .el-tabs__content {
  padding: 10px 0;
}

.stock-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.stock-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.stock-name {
  font-size: 18px;
  font-weight: bold;
}

.stock-price {
  font-size: 24px;
  font-weight: bold;
}

.stock-content {
  padding: 15px;
}

.stock-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stock-indicator-label {
  color: #666;
}

.stock-indicator-value {
  font-weight: bold;
}

/* 添加图表控制样式 */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 300px;
}

.control-label {
  font-size: 14px;
  color: var(--text-color-secondary);
  white-space: nowrap;
}

.year-display {
  font-size: 14px;
  color: var(--text-color);
  font-weight: bold;
  min-width: 40px;
}

/* 修改滑块样式 */
:deep(.el-slider) {
  margin: 0;
}

:deep(.el-slider__runway) {
  margin: 0;
}

:deep(.company-select-dropdown) {
  min-width: 280px !important;
}
</style>