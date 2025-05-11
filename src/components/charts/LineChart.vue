<template>
  <div class="chart-container">
    <div class="chart-header" v-if="title">
      <h3 class="chart-title">{{ title }}</h3>
    </div>
    <div class="chart-content" :style="{ height: height || '300px' }">
      <div ref="chartRef" class="echarts-container"></div>
      <div class="loading-overlay" v-if="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '300px'
  },
  chartOptions: { // 添加自定义选项
    type: Object,
    default: () => ({})
  }
});

const chartRef = ref(null);
let chart = null;

// 修改初始化图表和窗口大小变化处理函数
const initChart = () => {
  if (chartRef.value) {
    // 使用nextTick确保DOM已经渲染完成
    nextTick(() => {
      chart = echarts.init(chartRef.value);
      updateChart();
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize);
    });
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (chart) {
    // 使用nextTick避免在主进程中调用resize
    nextTick(() => {
      chart.resize();
    });
  }
};

// 更新图表
const updateChart = () => {
  if (!chart) return;
  
  const { xAxis, series } = props.chartData;
  
  if (!xAxis || !series || series.length === 0) {
    chart.showLoading({
      text: '暂无数据',
      maskColor: 'rgba(255, 255, 255, 0.1)',
      textColor: '#e0e0ff'
    });
    return;
  }
  
  chart.hideLoading();
  
  // 合并默认选项和自定义选项
  const options = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: series,
    ...props.chartOptions // 合并自定义选项
  };
  
  chart.setOption(options, true);
};

// 监听数据变化
watch(() => props.chartData, updateChart, { deep: true });
watch(() => props.chartOptions, updateChart, { deep: true });

// 监听加载状态
watch(() => props.loading, (newVal) => {
  if (chart) {
    if (newVal) {
      chart.showLoading({
        text: '加载中...',
        maskColor: 'rgba(255, 255, 255, 0.1)',
        textColor: '#e0e0ff'
      });
    } else {
      chart.hideLoading();
    }
  }
});

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  margin-bottom: 10px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #e0e0ff;
  margin: 0;
}

.chart-content {
  position: relative;
  flex: 1;
}

.echarts-container {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 10, 22, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 162, 255, 0.3);
  border-radius: 50%;
  border-top-color: #00a2ff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>