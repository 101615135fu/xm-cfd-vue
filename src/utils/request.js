import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 检查响应数据是否为空
    if (!res || (Array.isArray(res) && res.length === 0) || 
        (typeof res === 'object' && Object.keys(res).length === 0)) {
      console.warn('API返回空数据:', response.config.url)
    }
    return res
  },
  error => {
    console.error('响应错误：', error)
    
    // 错误处理逻辑
    let message = error.message || '请求失败'
    if (error.response) {
      // 服务器返回错误信息
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败: ${error.response.status}`
      }
    } else if (error.request) {
      // 请求发出但未收到响应
      message = '网络连接失败，请检查网络'
    }
    
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 财务数据API
export const financialApi = {
  // 获取财务数据，支持筛选
  getFinancialData(params) {
    return request.get('/financial/data/', { params })
  },
  
  // 获取按类别汇总的财务数据
  getFinancialSummary(params) {
    return request.get('/financial/summary/', { params })
  },
  
  // 获取时间序列的财务数据
  getTimeSeriesData(params) {
    return request.get('/financial/timeseries/', { params })
  },
  
  // 生成示例数据
  generateSampleData() {
    return request.post('/financial/generate_sample/')
  },

  // 获取股票数据 - 移除params参数
  getStockData() {
    return request.get('/stocks/quotes')
  },

  // 获取所有Item数据
  getAllItems() {
    return request.get('/list/selectAll/')
  },
}

export default request