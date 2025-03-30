<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="container">
        <div class="logo">
          <h1>XM-CFD</h1>
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
                    <router-link to="/category/productivity" class="category-link">工作与生产力</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/development" class="category-link">工程与开发</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/design" class="category-link">设计与创意</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/finance" class="category-link">金融</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/social" class="category-link">社交与社区</router-link>
                  </div>
                  <div class="category-item">
                    <router-link to="/category/ai-coding" class="category-link">AI编程</router-link>
                  </div>
                </div>
                
                <!-- 右侧内容区域 -->
                <div class="dropdown-details">
                  <h3>工作与生产力</h3>
                  <div class="dropdown-links-grid">
                    <a @click.prevent="navigateToProduct('ai-notes')" class="dropdown-link">AI笔记工具</a>
                    <a @click.prevent="navigateToProduct('app-switcher')" class="dropdown-link">应用切换器</a>
                    <a @click.prevent="navigateToProduct('compliance')" class="dropdown-link">合规软件</a>
                    <a @click.prevent="navigateToProduct('calendar')" class="dropdown-link">日历应用</a>
                    <a @click.prevent="navigateToProduct('project-management')" class="dropdown-link">项目管理软件</a>
                    <a @click.prevent="navigateToProduct('cursor')" class="dropdown-link">Cursor</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <router-link to="/main/dashboard" class="nav-link">数据库</router-link>
          <router-link to="/main/dashboard" class="nav-link">分析</router-link>
        </nav>
        <div class="auth-buttons">
          <button class="btn btn-login">登录</button>
          <button class="btn btn-signup">注册</button>
        </div>
      </div>
    </header>

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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 导航栏样式 */
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: relative;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  color: #0a2540;
  font-size: 24px;
}

.nav-links {
  display: flex;
  gap: 20px;
  position: relative;
}

.nav-link {
  color: #0a2540;
  text-decoration: none;
  font-weight: 500;
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
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
  margin-top: 15px;
}

.dropdown-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
}

.dropdown-content {
  display: flex;
  padding: 20px;
}

.dropdown-categories {
  width: 250px;
  border-right: 1px solid #eee;
  padding-right: 20px;
}

.category-item {
  margin-bottom: 15px;
}

.category-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.category-link:hover {
  background-color: #f5f8fa;
  color: #0a2540;
}

.dropdown-details {
  flex: 1;
  padding-left: 20px;
}

.dropdown-details h3 {
  margin-bottom: 15px;
  color: #0a2540;
  font-size: 18px;
}

.dropdown-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

/* 修改下拉链接样式，添加鼠标指针 */
.dropdown-link {
  cursor: pointer;
  color: #4a5568;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.dropdown-link:hover {
  color: #0a2540;
  text-decoration: underline;
}

/* 其他样式保持不变 */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-login {
  background-color: transparent;
  color: #0a2540;
  border: 1px solid #ddd;
}

.btn-signup {
  background-color: #0a2540;
  color: white;
}

.main-content {
  flex: 1;
}
</style>