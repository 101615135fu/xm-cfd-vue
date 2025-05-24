<template>
  <div class="dashboard">
    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-bg-overlay"></div>
      <div class="container">
        <h2 class="hero-title">创业<span class="highlight">平台</span></h2>
        <p class="hero-subtitle">发现、孵化和加速您的创业想法，连接投资人和创业资源</p>
        <div class="search-box">
          <input type="text" placeholder="搜索AI工具..." v-model="searchQuery" />
          <button class="search-btn">
            <el-icon><Search /></el-icon>
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">4,500+</span>
            <span class="stat-label">初创公司</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">120万+</span>
            <span class="stat-label">用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">每日更新</span>
            <span class="stat-label">最新数据</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势分类 -->
    <div class="category-tabs">
      <div class="container">
        <div class="tab-container">
          <button class="tab-btn active">热门推荐</button>
          <button class="tab-btn">最新上线</button>
          <button class="tab-btn">评分最高</button>
          <button class="tab-btn">免费工具</button>
        </div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="filter-section">
      <div class="container">
        <div class="filter-options">
          <div class="filter-group">
            <span class="filter-label">排序:</span>
            <el-select v-model="sortOption" placeholder="热门" size="small" style="min-width: 120px;">
              <el-option label="热门" value="popular"></el-option>
              <el-option label="最新" value="newest"></el-option>
              <el-option label="评分最高" value="highest_rated"></el-option>
            </el-select>
          </div>
          <div class="filter-group">
            <span class="filter-label">时间:</span>
            <el-select v-model="timeOption" placeholder="全部时间" size="small" style="min-width: 120px;">
              <el-option label="今天" value="today"></el-option>
              <el-option label="本周" value="this_week"></el-option>
              <el-option label="本月" value="this_month"></el-option>
              <el-option label="全部时间" value="all_time"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tags-filter">
          <el-tag 
            v-for="tag in tags" 
            :key="tag"
            :effect="selectedTags.includes(tag) ? 'dark' : 'plain'"
            @click="toggleTag(tag)"
            class="filter-tag"
            :class="{'selected-tag': selectedTags.includes(tag)}"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 产品列表 -->
    <section class="products-section">
      <div class="container">
        <div class="products-grid">
          <div 
            v-for="(product, index) in filteredProducts" 
            :key="index" 
            class="product-card"
            @click="navigateToProduct(product.id || product.name.toLowerCase().replace(/\s+/g, '-'))"
          >
            <div class="product-image">
              <img :src="product.image || 'https://via.placeholder.com/80'" :alt="product.name">
            </div>
            <div class="product-info">
              <div class="product-header">
                <h3 class="product-name">{{ product.name }}</h3>
                <span class="product-rank">#{{ index + 1 }}</span>
              </div>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-tags">
                <el-tag v-for="tag in product.tags" :key="tag" size="small" effect="plain" class="product-tag">{{ tag }}</el-tag>
              </div>
            </div>
            <div class="product-meta">
              <div class="product-rating">
                <span class="rating-star">★</span>
                <span class="rating-value">{{ product.rating || (Math.random() * 0.5 + 4.3).toFixed(1) }}</span>
              </div>
              <div class="upvotes">
                <el-button type="primary" plain size="small" class="upvote-btn" @click.stop>
                  <i class="el-icon-caret-top"></i> {{ product.upvotes || 0 }}
                </el-button>
              </div>
              <div class="product-comments">
                <span>{{ product.comments || 0 }} 评论</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多按钮 -->
        <div class="load-more">
          <el-button plain>探索更多AI工具</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { financialApi } from '@/utils/request';
// 引入Element Plus图标
import { Search } from '@element-plus/icons-vue';

const router = useRouter();

// 产品数据
const products = ref([]);
const isLoading = ref(false);

// 搜索和筛选状态
const searchQuery = ref('');
const sortOption = ref('popular');
const timeOption = ref('all_time');
const tags = ref(['大语言模型', 'AI编程', '文本转语音', '语音AI', 'AI基础设施', '图像生成', '创作工具', '聊天机器人', '开发工具']);
const selectedTags = ref([]);

// 切换标签选择
const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const load = () => {
  financialApi.getAllItems().then(response => {
    products.value = response.data;
    console.log(products.value);
  }).catch(error => {
    console.error('获取数据失败:', error);
  });
}

load();

// 过滤产品
const filteredProducts = computed(() => {
  let result = products.value;
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
  }
  
  // 标签过滤
  if (selectedTags.value.length > 0) {
    result = result.filter(product => 
      selectedTags.value.some(tag => product.tags.includes(tag))
    );
  }
  
  // 排序
  if (sortOption.value === 'popular') {
    result = [...result].sort((a, b) => b.upvotes - a.upvotes);
  } else if (sortOption.value === 'newest') {
    // 假设有日期字段，这里简化处理
    result = [...result].reverse();
  } else if (sortOption.value === 'highest_rated') {
    result = [...result].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
  }
  
  return result;
});

// 加载Excel数据
const loadExcelData = async () => {
  try {
    isLoading.value = true;
    
    // 使用ProductHunt的数据
    const data = [
      {
        name: "Cursor",
        description: "Built to make you extraordinarily productive, Cursor is the best way to code with AI.",
        image: "https://ph-files.imgix.net/ada2695b-e20b-4c1b-b04a-e0fbd9daf466.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "代码编辑器", "开发工具"],
        upvotes: 3254,
        comments: 157,
        rating: 4.8,
        url: "https://www.producthunt.com/products/cursor"
      },
      {
        name: "Lovable",
        description: "The AI Fullstack Engineer that works. Ship lovable full-stack applications 20x faster than by writing code ❤",
        image: "https://ph-files.imgix.net/c7e0f451-1ad5-4d26-b5fd-075ae3aa9db4.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=188&h=118&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "无代码平台", "全栈开发"],
        upvotes: 2987,
        comments: 245,
        rating: 4.7,
        url: "https://www.producthunt.com/products/lovable"
      },
      {
        name: "Replit",
        description: "Replit turns your ideas into apps, fast. With Replit's Agent and Assistant, create apps from natural language and launch in a single click.",
        image: "https://ph-files.imgix.net/5f621a68-2838-4ad2-97a5-fd3fc6dad117.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "代码编辑器", "应用开发"],
        upvotes: 2543,
        comments: 25,
        rating: 3.9,
        url: "https://www.producthunt.com/products/replit"
      },
      {
        name: "Windsurf",
        description: "Windsurf is an IDE that enables anyone to collaborate in lockstep with AI. Built by the Codeium team.",
        image: "https://ph-files.imgix.net/eeb9b2eb-49ed-4be5-8db0-4bd1a01d39e4.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "代码编辑器", "协作工具"],
        upvotes: 2321,
        comments: 43,
        rating: 4.9,
        url: "https://www.producthunt.com/products/windsurf"
      },
      {
        name: "Zed",
        description: "Zed is a next-generation code editor designed for high-performance collaboration with humans and AI.",
        image: "https://ph-files.imgix.net/5e384dcc-8e07-4d0a-93b6-720c0bb005b6.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "代码编辑器", "协作工具"],
        upvotes: 2156,
        comments: 30,
        rating: 4.9,
        url: "https://www.producthunt.com/products/zed"
      },
      {
        name: "Github Copilot",
        description: "GitHub Copilot works alongside you directly in your editor, suggesting whole lines or entire functions for you. Powered by OpenAI.",
        image: "https://ph-files.imgix.net/9511fe6d-3bff-472b-ab02-f1c38d036235.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "代码助手", "开发工具"],
        upvotes: 1987,
        comments: 11,
        rating: 4.8,
        url: "https://www.producthunt.com/products/github-copilot"
      },
      {
        name: "Warp",
        description: "Warp is the terminal with AI and your dev team's knowledge built-in.",
        image: "https://ph-files.imgix.net/914cce51-89c3-4884-aa9f-9a7481721517.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "终端工具", "开发工具"],
        upvotes: 1876,
        comments: 159,
        rating: 4.8,
        url: "https://www.producthunt.com/products/warp"
      },
      {
        name: "PyTorch",
        description: "Machine learning library based on the Torch library",
        image: "https://ph-files.imgix.net/37d77c0c-f875-49bc-a840-a347e9ee4a5f.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["AI编程", "机器学习", "AI基础设施"],
        upvotes: 1654,
        comments: 1,
        rating: 5.0,
        url: "https://www.producthunt.com/products/pytorch-2"
      },
      {
        name: "JetBrains WebStorm",
        description: "Make development more productive and enjoyable with WebStorm, the IDE for JavaScript and related technologies.",
        image: "https://ph-files.imgix.net/76f1e56d-bff2-464f-9c6a-6ed35594cb90.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["代码编辑器", "开发工具", "JavaScript"],
        upvotes: 1543,
        comments: 2,
        rating: 5.0,
        url: "https://www.producthunt.com/products/webstorm"
      },
      {
        name: "Cheat Layer",
        description: "Cheat Layer builds entire automations for you from end-to-end in simple language, meeting all users at their level of understanding.",
        image: "https://ph-files.imgix.net/37b0455d-2bbc-4be6-986f-585f2fe75689.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=40&h=40&fit=crop&frame=1&dpr=1",
        tags: ["无代码平台", "自动化工具", "AI助手"],
        upvotes: 1432,
        comments: 89,
        rating: 4.8,
        url: "https://www.producthunt.com/products/cheat-layer"
      }
    ];
    
    // 转换数据结构
    products.value = data.map(item => {
      return {
        id: item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        description: item.description,
        image: item.image,
        tags: typeof item.tags === 'string' ? item.tags.split(',') : item.tags,
        upvotes: item.upvotes,
        comments: item.comments,
        rating: item.rating,
        url: item.url // 添加ProductHunt URL
      };
    });
    
  } catch (error) {
    console.error('加载数据失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadExcelData();
});

// 添加导航到产品详情页的方法
const navigateToProduct = (productId) => {
  // 查找对应产品
  const product = products.value.find(p => p.id === productId);
  if (product && product.url) {
    // 使用ProductHunt URL打开新窗口
    window.open(product.url, '_blank');
  } else {
    // 如果没有URL，使用原来的路由导航
    router.push({ name: 'product-detail', params: { id: productId } });
  }
};
</script>

<style scoped>
/* 全局暗色科技风格 */
.dashboard {
  background-color: #0a0a16;
  color: #e0e0ff;
  position: relative;
  min-height: 100vh;
}

/* 英雄部分样式 */
.hero-section {
  background: linear-gradient(135deg, #050c20 0%, #0f1634 100%);
  padding: 120px 0 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0, 106, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(94, 0, 255, 0.15) 0%, transparent 40%);
  z-index: 1;
}

.hero-section .container {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 52px;
  color: #ffffff;
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(0, 162, 255, 0.3);
}

.hero-title .highlight {
  background: linear-gradient(90deg, #00a2ff, #7000ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.hero-title .highlight:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #00a2ff, #7000ff);
  box-shadow: 0 0 10px rgba(112, 0, 255, 0.8);
}

.hero-subtitle {
  font-size: 22px;
  color: rgba(224, 224, 255, 0.9);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 60px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #00a2ff;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

.stat-label {
  font-size: 15px;
  color: rgba(224, 224, 255, 0.7);
  letter-spacing: 0.5px;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  border: 1px solid rgba(0, 140, 255, 0.3);
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 162, 255, 0.2);
  transition: all 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 0 40px rgba(0, 162, 255, 0.3);
  transform: translateY(-2px);
}

.search-box input {
  flex: 1;
  padding: 18px 24px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #e0e0ff;
}

.search-box input::placeholder {
  color: rgba(224, 224, 255, 0.5);
}

.search-box input:focus {
  outline: none;
}

.search-btn {
  padding: 0 30px;
  background: linear-gradient(90deg, #00a2ff, #7000ff);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn .el-icon {
  font-size: 20px;
}

.search-btn:hover {
  background: linear-gradient(90deg, #0066ff, #8c00ff);
}

/* 分类标签区域 */
.category-tabs {
  background-color: rgba(10, 12, 26, 0.85);
  border-bottom: 1px solid rgba(0, 140, 255, 0.2);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.tab-container {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}

.tab-container::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 22px 28px;
  background: transparent;
  border: none;
  color: rgba(224, 224, 255, 0.7);
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  letter-spacing: 0.5px;
}

.tab-btn:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #00a2ff, #7000ff);
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(112, 0, 255, 0.6);
}

.tab-btn:hover {
  color: #e0e0ff;
}

.tab-btn.active {
  color: #00a2ff;
}

.tab-btn.active:after {
  width: 100%;
}

/* 筛选部分样式 */
.filter-section {
  padding: 28px 0;
  border-bottom: 1px solid rgba(0, 140, 255, 0.1);
  background-color: rgba(11, 13, 28, 0.7);
}

.filter-options {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-right: 28px;
}

.filter-group :deep(.el-select) {
  min-width: 120px;
}

.filter-label {
  margin-right: 10px;
  color: rgba(224, 224, 255, 0.7);
  font-size: 14px;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tag {
  cursor: pointer;
  background-color: rgba(0, 140, 255, 0.08) !important;
  border-color: rgba(0, 140, 255, 0.3) !important;
  color: rgba(224, 224, 255, 0.9) !important;
  transition: all 0.3s ease;
  padding: 8px 15px !important;
  border-radius: 8px !important;
}

.filter-tag:hover {
  background-color: rgba(0, 140, 255, 0.15) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.selected-tag {
  background-color: rgba(0, 140, 255, 0.25) !important;
  color: #ffffff !important;
  border-color: rgba(0, 162, 255, 0.5) !important;
  box-shadow: 0 0 10px rgba(0, 140, 255, 0.3);
}

/* 产品列表样式 */
.products-section {
  padding: 50px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.product-card {
  display: flex;
  padding: 28px;
  border-radius: 12px;
  background-color: rgba(15, 18, 36, 0.6);
  border: 1px solid rgba(64, 153, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.product-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(64, 153, 255, 0.05) 0%, rgba(114, 0, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(64, 153, 255, 0.15);
  border-color: rgba(64, 153, 255, 0.3);
}

.product-card:hover:before {
  opacity: 1;
}

.product-image {
  width: 80px;
  height: 80px;
  margin-right: 24px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.product-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  background: linear-gradient(90deg, #e0e0ff, #b5b8ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.product-rank {
  font-size: 14px;
  font-weight: 700;
  color: rgba(224, 224, 255, 0.7);
  background: rgba(64, 153, 255, 0.2);
  padding: 5px 10px;
  border-radius: 20px;
}

.product-description {
  color: rgba(224, 224, 255, 0.8);
  margin-bottom: 15px;
  font-size: 15px;
  line-height: 1.5;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-tag {
  background-color: rgba(114, 0, 255, 0.1) !important;
  border-color: rgba(114, 0, 255, 0.2) !important;
  color: rgba(224, 224, 255, 0.9) !important;
  font-size: 12px !important;
  transition: all 0.3s ease;
}

.product-tag:hover {
  background-color: rgba(114, 0, 255, 0.2) !important;
  transform: translateY(-2px);
}

.product-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 120px;
  position: relative;
  z-index: 1;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.rating-star {
  color: #ffcb45;
  font-size: 18px;
  margin-right: 5px;
  text-shadow: 0 0 5px rgba(255, 203, 69, 0.5);
}

.rating-value {
  color: #fff;
  font-weight: 600;
}

.upvote-btn {
  background-color: rgba(64, 153, 255, 0.1) !important;
  border-color: rgba(64, 153, 255, 0.3) !important;
  color: #4099ff !important;
  font-size: 16px !important;
  padding: 12px 30px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.upvote-btn:hover {
  background-color: #4099ff !important;
  color: white !important;
  box-shadow: 0 0 15px rgba(64, 153, 255, 0.4);
  transform: translateY(-2px);
}

.product-comments {
  font-size: 14px;
  color: rgba(224, 224, 255, 0.7);
  margin-top: 10px;
}

.load-more {
  text-align: center;
  margin-top: 50px;
}

.load-more .el-button {
  background-color: rgba(64, 153, 255, 0.1) !important;
  border-color: rgba(64, 153, 255, 0.3) !important;
  color: #4099ff !important;
  font-size: 16px !important;
  padding: 12px 30px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.load-more .el-button:hover {
  background-color: rgba(64, 153, 255, 0.2) !important;
  border-color: rgba(64, 153, 255, 0.4) !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>