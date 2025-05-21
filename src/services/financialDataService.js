import axios from 'axios';
import { saveAs } from 'file-saver'; // 需要安装: npm install file-saver

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

// 新增: 将股票数据保存为CSV文件
export async function saveStockDataToCSV(symbols) {
  try {
    // 获取多个股票数据
    const stocksData = await getMultipleStocks(symbols);
    
    // 创建CSV内容
    let csvContent = "symbol,company,price,change,changePercent,open,high,low,volume,latestTradingDay,previousClose\n";
    
    stocksData.forEach(stock => {
      if (stock['Global Quote']) {
        const quote = stock['Global Quote'];
        const companyName = getCompanyNameForCSV(quote['01. symbol']);
        
        csvContent += `${quote['01. symbol']},${companyName},${quote['05. price']},${quote['09. change']},` +
                     `${quote['10. change percent']},${quote['02. open']},${quote['03. high']},` +
                     `${quote['04. low']},${quote['06. volume']},${quote['07. latest trading day']},` +
                     `${quote['08. previous close']}\n`;
      }
    });
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    // 保存文件
    saveAs(blob, 'assets/stock_data.csv');
    
    return { success: true, message: '股票数据已保存为CSV文件' };
  } catch (error) {
    console.error('保存股票数据到CSV失败:', error);
    throw error;
  }
}

// 获取公司名称 (用于CSV)
function getCompanyNameForCSV(symbol) {
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
}

// 新增: 从CSV文件读取股票数据
export async function readStockDataFromCSV() {
  try {
    const response = await fetch('/assets/stock_data.csv');
    const csvText = await response.text();
    
    // 解析CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const stocksData = [];
    
    // 从第二行开始解析数据行
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // 跳过空行
      
      const values = lines[i].split(',');
      const stock = {};
      
      // 将CSV数据映射到与API返回格式相似的结构
      stock.symbol = values[0];
      stock.shortName = values[0];
      stock.displayName = values[1];
      stock.price = values[2];
      stock.change = values[3];
      stock['change percent'] = values[4];
      stock.open = values[5];
      stock.high = values[6];
      stock.low = values[7];
      stock.volume = values[8];
      stock['latest trading day'] = values[9];
      stock['previous close'] = values[10];
      
      stocksData.push(stock);
    }
    
    return stocksData;
  } catch (error) {
    console.error('从CSV读取股票数据失败:', error);
    throw error;
  }
}