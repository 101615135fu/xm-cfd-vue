import axios from 'axios';

// 配置API密钥和基础URL
const API_KEY = 'BR3MCQ268E2X7TR9'; // 需要替换为您的API密钥
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// 获取股票实时数据
export async function getStockQuote(symbol) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}股票数据失败:`, error);
    throw error;
  }
}

// 获取股票历史数据
export async function getStockHistory(symbol, interval = 'monthly', outputsize = 'compact') {
  try {
    const functionName = interval === 'daily' 
      ? 'TIME_SERIES_DAILY' 
      : interval === 'weekly'
        ? 'TIME_SERIES_WEEKLY'
        : 'TIME_SERIES_MONTHLY';
        
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: functionName,
        symbol,
        outputsize, // 'compact'返回最近100个数据点，'full'返回全部历史数据
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}历史数据失败:`, error);
    throw error;
  }
}

// 添加新函数：处理时间轴数据格式化
export function formatTimeSeriesData(data, yearsToShow = 5) {
  if (!data || !data['Monthly Time Series']) {
    return { dates: [], values: [] };
  }
  
  const timeSeriesData = data['Monthly Time Series'];
  let dates = Object.keys(timeSeriesData).sort();
  
  // 默认只显示最近几年的数据
  const currentDate = new Date();
  const startYear = currentDate.getFullYear() - yearsToShow;
  const startDate = `${startYear}-01-01`;
  
  // 过滤最近几年的数据
  dates = dates.filter(date => date >= startDate);
  
  // 提取收盘价格
  const values = dates.map(date => parseFloat(timeSeriesData[date]['4. close']));
  
  return { 
    dates, 
    values,
    // 添加格式化后的年份和季度数据，用于图表显示
    yearLabels: generateYearLabels(dates),
    quarterLabels: generateQuarterLabels(dates)
  };
}

// 生成年份标签
function generateYearLabels(dates) {
  const years = new Set();
  const yearLabels = [];
  
  dates.forEach(date => {
    const year = date.substring(0, 4);
    if (!years.has(year)) {
      years.add(year);
      yearLabels.push({
        value: date,
        label: year
      });
    }
  });
  
  return yearLabels;
}

// 生成季度标签
function generateQuarterLabels(dates) {
  const quarters = new Set();
  const quarterLabels = [];
  
  dates.forEach(date => {
    const year = date.substring(0, 4);
    const month = parseInt(date.substring(5, 7));
    const quarter = Math.ceil(month / 3);
    const quarterKey = `${year}-Q${quarter}`;
    
    if (!quarters.has(quarterKey)) {
      quarters.add(quarterKey);
      quarterLabels.push({
        value: date,
        label: quarterKey
      });
    }
  });
  
  return quarterLabels;
}

// 获取公司财务报表数据
export async function getCompanyFinancials(symbol) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'INCOME_STATEMENT',
        symbol,
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}财务报表失败:`, error);
    throw error;
  }
}

// 获取多个股票的数据
export async function getMultipleStocks(symbols) {
  try {
    const promises = symbols.map(symbol => getStockQuote(symbol));
    return await Promise.all(promises);
  } catch (error) {
    console.error('获取多个股票数据失败:', error);
    throw error;
  }
}