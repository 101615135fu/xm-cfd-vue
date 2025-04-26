import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 这里可以添加认证信息，如token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    const data = response.data
    // 检查响应数据是否为空
    if (!data || (Array.isArray(data) && data.length === 0) || 
        (typeof data === 'object' && Object.keys(data).length === 0)) {
      console.warn('API返回空数据:', response.config.url)
    }
    return data
  },
  error => {
    // 原有的错误处理逻辑保持不变
    let message = '请求失败'
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
    
    console.error('API错误:', message)
    return Promise.reject(error)
  }
)

// 财务数据API
const financialApi = {
  // 获取财务数据，支持筛选
  getFinancialData(params) {
    return api.get('/financial/data/', { params })
  },
  
  // 获取按类别汇总的财务数据
  getFinancialSummary(params) {
    return api.get('/financial/summary/', { params })
  },
  
  // 获取时间序列的财务数据
  getTimeSeriesData(params) {
    return api.get('/financial/timeseries/', { params })
  },
  
  // 生成示例数据
  generateSampleData() {
    return api.post('/financial/generate_sample/')
  },

  // 获取股票数据
  getStockData(params) {
    return api.get('/stocks/quotes/', { params })
  },

  //获取所有Item数据
  getAllItems() {
    return api.get('/list/selectAll/')
  },
}

export { financialApi }
export default api