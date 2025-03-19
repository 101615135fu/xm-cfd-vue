<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="container">
        <div class="logo">
          <h1>XM-CFD</h1>
        </div>
        <nav class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/discover" class="nav-link">发现</router-link>
          <router-link to="/database" class="nav-link">数据库</router-link>
          <router-link to="/analysis" class="nav-link">分析</router-link>
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
// 这里可以添加需要的逻辑
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
}

.nav-link {
  color: #0a2540;
  text-decoration: none;
  font-weight: 500;
}

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

/* 主要内容区域样式 */
.main-content {
  flex: 1;
}
</style>