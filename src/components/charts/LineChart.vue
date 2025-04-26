<template>
  <div class="chart-container">
    <div ref="chartRef" class="echarts-container"></div>
    <div v-if="loading" class="loading-overlay">
      <el-icon class="loading-icon"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({ xAxis: [], series: [] })
  },
  title: {
    type: String,
    default: '数据趋势'
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '400px'
  }
})

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    setOptions()
    
    // 响应式处理
    window.addEventListener('resize', chart.resize)
  }
}

const setOptions = () => {
  const option = {
    title: {
      text: props.title,
      textStyle: {
        color: '#333',
        fontSize: 16
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      confine: true
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.chartData.xAxis || [],
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: props.chartData.series || [],
    color: ['#1e88e5', '#4caf50', '#ff9800', '#f44336']
  }
  
  chart && chart.setOption(option)
}

// 监听数据变化自动更新图表
watch(() => props.chartData, () => {
  setOptions()
}, { deep: true })

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    window.removeEventListener('resize', chart.resize)
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: v-bind('props.height');
  background-color: #fff;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.echarts-container {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-md);
}

.loading-icon {
  font-size: 32px;
  color: var(--primary-color);
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 