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
    default: '数据对比'
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '400px'
  },
  // 添加横向柱状图控制属性
  horizontal: {
    type: Boolean,
    default: false
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
  // 根据是否为横向柱状图调整配置
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
      }
    },
    legend: {
      // 如果图表数据中指定了legend配置，优先使用
      show: props.chartData.legend?.show !== undefined ? props.chartData.legend.show : true,
      data: props.chartData.series?.map(item => item.name).filter(Boolean) || [],
      bottom: 0
    },
    grid: {
      left: props.horizontal ? '15%' : '3%', // 横向图表需要更多左侧空间显示标签
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    // 根据horizontal属性交换x轴和y轴的配置
    xAxis: props.horizontal ? {
      type: 'value',
      name: props.chartData.xAxis?.name || '',
      nameLocation: 'middle',
      nameGap: 30
    } : {
      type: 'category',
      data: props.chartData.xAxis || [],
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: props.horizontal ? {
      type: 'category',
      data: props.chartData.yAxis || props.chartData.xAxis || [], // 支持yAxis或fallback到xAxis
      axisLabel: {
        interval: 0
      }
    } : {
      type: 'value',
      name: props.chartData.yAxis?.name || ''
    },
    series: props.chartData.series?.map(item => ({
      ...item,
      type: 'bar',
      barMaxWidth: props.horizontal ? 20 : 40, // 横向柱状图柱子宽度调小
      itemStyle: {
        borderRadius: props.horizontal ? 
          [0, 4, 4, 0] : // 横向柱状图圆角在右侧
          [4, 4, 0, 0]   // 垂直柱状图圆角在顶部
      }
    })) || [],
    color: ['#1e88e5', '#4caf50', '#ff9800', '#f44336']
  }
  
  chart && chart.setOption(option)
}

// 监听数据变化自动更新图表
watch(() => props.chartData, () => {
  setOptions()
}, { deep: true })

// 监听horizontal属性变化
watch(() => props.horizontal, () => {
  setOptions()
})

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