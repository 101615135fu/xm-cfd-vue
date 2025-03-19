<template>
  <div class="dashboard">
    <div class="hero-section">
      <div class="container">
        <h2 class="hero-title">发现和连接全球商业信息</h2>
        <p class="hero-subtitle">获取关于公司、投资者和行业趋势的最新数据</p>
        <div class="search-box">
          <input type="text" placeholder="搜索公司、人员或投资者..." />
          <button class="search-btn">搜索</button>
        </div>
      </div>
    </div>

    <!-- 趋势部分 -->
    <section class="trends-section">
      <div class="container">
        <h3 class="section-title">热门趋势</h3>
        <div class="trends-grid">
          <div class="trend-card">
            <h4>人工智能</h4>
            <p>探索AI领域的最新发展和投资趋势</p>
          </div>
          <div class="trend-card">
            <h4>金融科技</h4>
            <p>了解金融科技创新和市场动态</p>
          </div>
          <div class="trend-card">
            <h4>可持续发展</h4>
            <p>关注环保和可持续发展领域的投资机会</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 这里可以添加需要的逻辑
</script>

<style scoped>
/* 英雄部分样式 */
.hero-section {
  background-color: #f5f8fa;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 36px;
  color: #0a2540;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 18px;
  color: #4a5568;
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
}

.search-box input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-btn {
  padding: 12px 24px;
  background-color: #0a2540;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-weight: 500;
}

/* 趋势部分样式 */
.trends-section {
  padding: 60px 0;
}

.section-title {
  font-size: 24px;
  color: #0a2540;
  margin-bottom: 24px;
  text-align: center;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.trend-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.3s ease;
}

.trend-card:hover {
  transform: translateY(-5px);
}

.trend-card h4 {
  font-size: 18px;
  color: #0a2540;
  margin-bottom: 12px;
}

.trend-card p {
  color: #4a5568;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>