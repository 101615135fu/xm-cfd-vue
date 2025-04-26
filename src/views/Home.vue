<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="container">
        <div class="logo">
          <h1>AI-CFD</h1>
        </div>
        <nav class="nav-links">
          <router-link to="/main/dashboard" class="nav-link">首页</router-link>
          
          <!-- 发现导航项带下拉菜单 -->
          <div class="dropdown-container">
            <router-link to="/main/dashboard" class="nav-link">发现</router-link>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <!-- 左侧分类菜单 -->
                <div class="dropdown-categories">
                  <div class="category-item">
                    <router-link to="/category/productivity" class="category-link">AI助手与生产力</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/development" class="category-link">AI开发工具</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/design" class="category-link">AI设计与创意</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/finance" class="category-link">AI金融应用</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/ai-coding" class="category-link">AI编程助手</router-link>
                  </div>
                </div>
                
                <!-- 右侧内容区域 -->
                <div class="dropdown-details">
                  <h3>AI助手与生产力</h3>
                  <div class="dropdown-links-grid">
                    <a @click.prevent="navigateToProduct('chatgpt')" class="dropdown-link">ChatGPT</a>
                    <a @click.prevent="navigateToProduct('claude')" class="dropdown-link">Claude</a>
                    <a @click.prevent="navigateToProduct('gemini')" class="dropdown-link">Gemini</a>
                    <a @click.prevent="navigateToProduct('cursor')" class="dropdown-link">Cursor</a>
                    <a @click.prevent="navigateToProduct('codeium')" class="dropdown-link">Codeium</a>
                    <a @click.prevent="navigateToProduct('github-copilot')" class="dropdown-link">GitHub Copilot</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <router-link to="/category/llm" class="nav-link">大语言模型</router-link>
          <router-link to="/category/voice" class="nav-link">语音AI</router-link>
          <router-link to="/main/data-visualization" class="nav-link nav-link-highlight">财务分析</router-link>
        </nav>
        <div class="auth-buttons">
          <button class="btn btn-login">登录</button>
          <button class="btn btn-signup">注册</button>
        </div>
      </div>
    </header>

    <!-- 粒子背景 -->
    <div class="particles-container">
      <div class="particle" v-for="n in 30" :key="n"></div>
    </div>

    <!-- 主要内容区域 - 使用 RouterView -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 添加导航到产品详情页的方法
const navigateToProduct = (productId) => {
  router.push({ name: 'product-detail', params: { id: productId } });
};
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a0a16;
  color: #e0e6ff;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  position: relative;
  z-index: 5;
}

/* 粒子背景效果 */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: rgba(64, 153, 255, 0.6);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

.particle:nth-child(even) {
  background-color: rgba(120, 87, 255, 0.4);
  width: 3px;
  height: 3px;
}

.particle:nth-child(3n) {
  background-color: rgba(0, 217, 255, 0.5);
  width: 2.5px;
  height: 2.5px;
}

.particle:nth-child(5n) {
  background-color: rgba(128, 0, 255, 0.3);
  width: 1.5px;
  height: 1.5px;
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20vw);
    opacity: 0;
  }
}

/* 动态分配粒子的初始位置 */
.particle:nth-child(1) { left: 5%; animation-duration: 45s; animation-delay: 0s; }
.particle:nth-child(2) { left: 10%; animation-duration: 40s; animation-delay: 1s; }
.particle:nth-child(3) { left: 15%; animation-duration: 35s; animation-delay: 2s; }
.particle:nth-child(4) { left: 20%; animation-duration: 30s; animation-delay: 3s; }
.particle:nth-child(5) { left: 25%; animation-duration: 40s; animation-delay: 4s; }
.particle:nth-child(6) { left: 30%; animation-duration: 35s; animation-delay: 5s; }
.particle:nth-child(7) { left: 35%; animation-duration: 30s; animation-delay: 6s; }
.particle:nth-child(8) { left: 40%; animation-duration: 40s; animation-delay: 7s; }
.particle:nth-child(9) { left: 45%; animation-duration: 35s; animation-delay: 8s; }
.particle:nth-child(10) { left: 50%; animation-duration: 30s; animation-delay: 9s; }
.particle:nth-child(11) { left: 55%; animation-duration: 40s; animation-delay: 10s; }
.particle:nth-child(12) { left: 60%; animation-duration: 35s; animation-delay: 11s; }
.particle:nth-child(13) { left: 65%; animation-duration: 30s; animation-delay: 12s; }
.particle:nth-child(14) { left: 70%; animation-duration: 40s; animation-delay: 13s; }
.particle:nth-child(15) { left: 75%; animation-duration: 35s; animation-delay: 14s; }
.particle:nth-child(16) { left: 80%; animation-duration: 30s; animation-delay: 15s; }
.particle:nth-child(17) { left: 85%; animation-duration: 40s; animation-delay: 16s; }
.particle:nth-child(18) { left: 90%; animation-duration: 35s; animation-delay: 17s; }
.particle:nth-child(19) { left: 95%; animation-duration: 30s; animation-delay: 18s; }
.particle:nth-child(20) { left: 7%; animation-duration: 40s; animation-delay: 19s; }
.particle:nth-child(21) { left: 14%; animation-duration: 35s; animation-delay: 20s; }
.particle:nth-child(22) { left: 21%; animation-duration: 30s; animation-delay: 21s; }
.particle:nth-child(23) { left: 28%; animation-duration: 40s; animation-delay: 22s; }
.particle:nth-child(24) { left: 35%; animation-duration: 35s; animation-delay: 23s; }
.particle:nth-child(25) { left: 42%; animation-duration: 30s; animation-delay: 24s; }
.particle:nth-child(26) { left: 49%; animation-duration: 40s; animation-delay: 25s; }
.particle:nth-child(27) { left: 56%; animation-duration: 35s; animation-delay: 26s; }
.particle:nth-child(28) { left: 63%; animation-duration: 30s; animation-delay: 27s; }
.particle:nth-child(29) { left: 70%; animation-duration: 40s; animation-delay: 28s; }
.particle:nth-child(30) { left: 77%; animation-duration: 35s; animation-delay: 29s; }

/* 导航栏样式 */
.navbar {
  background-color: rgba(14, 14, 30, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 25px rgba(0, 140, 255, 0.15);
  padding: 18px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(64, 153, 255, 0.2);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #4099ff, #704eff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(64, 153, 255, 0.5);
}

.nav-links {
  display: flex;
  gap: 25px;
  position: relative;
}

.nav-link {
  color: #e0e6ff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;
}

.nav-link:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4099ff, #704eff);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #fff;
}

.nav-link:hover:after {
  width: 100%;
}

/* 下拉菜单样式 */
.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: -200px; /* 调整位置使下拉菜单居中 */
  width: 800px;
  background-color: rgba(14, 14, 30, 0.9);
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(64, 153, 255, 0.2);
  border-radius: 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 100;
  margin-top: 15px;
  border: 1px solid rgba(64, 153, 255, 0.2);
  transform: translateY(10px);
}

.dropdown-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-content {
  display: flex;
  padding: 25px;
}

.dropdown-categories {
  width: 250px;
  border-right: 1px solid rgba(64, 153, 255, 0.2);
  padding-right: 20px;
}

.category-item {
  margin-bottom: 15px;
}

.category-link {
  color: #e0e6ff;
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.category-link:hover {
  background-color: rgba(64, 153, 255, 0.15);
  color: #fff;
  transform: translateX(5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.dropdown-details {
  flex: 1;
  padding-left: 25px;
}

.dropdown-details h3 {
  margin-bottom: 20px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(90deg, #4099ff, #704eff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.dropdown-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.dropdown-link {
  cursor: pointer;
  color: #a0aace;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 10px;
  border-radius: 6px;
}

.dropdown-link:hover {
  color: #fff;
  background-color: rgba(64, 153, 255, 0.1);
  transform: translateX(3px);
}

/* 按钮样式 */
.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.btn-login {
  background-color: transparent;
  color: #e0e6ff;
  border: 1px solid rgba(64, 153, 255, 0.4);
}

.btn-login:hover {
  background-color: rgba(64, 153, 255, 0.1);
  border-color: rgba(64, 153, 255, 0.6);
  transform: translateY(-2px);
}

.btn-signup {
  background: linear-gradient(135deg, #4099ff, #704eff);
  color: white;
  box-shadow: 0 4px 10px rgba(64, 153, 255, 0.3);
}

.btn-signup:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(64, 153, 255, 0.4);
  background: linear-gradient(135deg, #4099ff, #8043ff);
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 2;
}
</style>