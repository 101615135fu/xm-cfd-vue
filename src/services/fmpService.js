import axios from 'axios';

// 配置API密钥和基础URL
const API_KEY = 'CrUTqGhD5tukrSDrpk8ATDXSwbFl08nh'; // 需要注册获取免费API密钥
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// 获取公司收入报表
export async function getIncomeStatement(symbol, period = 'annual', limit = 5) {
  try {
    const response = await axios.get(`${FMP_BASE_URL}/income-statement/${symbol}`, {
      params: {
        period,
        limit,
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}收入报表失败:`, error);
    throw error;
  }
}

// 获取资产负债表
export async function getBalanceSheet(symbol, period = 'annual', limit = 5) {
  try {
    const response = await axios.get(`${FMP_BASE_URL}/balance-sheet-statement/${symbol}`, {
      params: {
        period,
        limit,
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}资产负债表失败:`, error);
    throw error;
  }
}

// 获取现金流量表
export async function getCashFlowStatement(symbol, period = 'annual', limit = 5) {
  try {
    const response = await axios.get(`${FMP_BASE_URL}/cash-flow-statement/${symbol}`, {
      params: {
        period,
        limit,
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}现金流量表失败:`, error);
    throw error;
  }
}

// 获取公司财务比率
export async function getFinancialRatios(symbol, period = 'annual', limit = 5) {
  try {
    const response = await axios.get(`${FMP_BASE_URL}/ratios/${symbol}`, {
      params: {
        period,
        limit,
        apikey: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`获取${symbol}财务比率失败:`, error);
    throw error;
  }
}