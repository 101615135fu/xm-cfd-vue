<template>
  <div class="home-page">
    <!-- 移除wave元素，简化背景结构 -->
    <div class="background">
      <img src="../assets/background.webp" alt="background" class="background-image">
    </div>
    
    <div class="notification">
      <span><span class="icon">🚀</span> 创业主意孵化器分为初创公司内容查询以及大模型问答模块，欢迎查看详情。</span>
    </div>
    
    <div class="content">
      <div class="logo">创业主意孵化器</div>
      <div class="slogan">探索初创公司背后的秘密</div>
      
      <div class="card-container">
        <div class="card" @click="startChat">
          <div class="card-title">开始对话</div>
          <div class="card-description">
            与大模型对话<br>
            体验全新初创资讯服务
          </div>
        </div>
        
        <div class="card" @click="getApp">
          <div class="card-title">获取初创公司信息</div>
          <div class="card-description">
            这里拥有大量初创公司信息<br>
            搜索你想要了解的初创公司
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 页面交互方法
const startChat = () => {
  // 跳转到聊天页面或其他操作
  router.push('/chat')
}

const getApp = () => {
  // 跳转到App下载页面或打开下载弹窗
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.home-page {
  /* 修改背景图样式以铺满页面 */
  background-image: url('@/assets/background.webp');
  background-size: cover; /* 使用cover属性使背景图铺满页面 */
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/background.webp');
  background-size: cover; /* 使用cover属性使背景图铺满页面 */
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
  opacity: 0.3;
}

.notification {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #333;
  font-size: 14px;
  padding: 10px;
}

.notification span {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px 15px;
  border-radius: 20px;
}

.notification .icon {
  color: #f5a623;
  margin-right: 5px;
}

.content {
  text-align: center;
  z-index: 1;
  /* 调整内容位置，更接近截图 */
  padding-top: 80px;
}

.logo {
  font-size: 60px;
  font-weight: bold;
  color: #0088ff;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.slogan {
  font-size: 24px;
  color: #333;
  margin-bottom: 50px;
}

.card-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 30px;
  width: 280px;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
}

.card-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.card-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
    align-items: center;
  }
  
  .card {
    width: 90%;
    max-width: 280px;
  }
  
  .logo {
    font-size: 40px;
  }
  
  .slogan {
    font-size: 20px;
    margin-bottom: 30px;
  }
}
</style>