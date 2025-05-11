<template>
  <div class="dashboard">
    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-bg-overlay"></div>
      <div class="container">
        <h2 class="hero-title">发现顶尖<span class="highlight">AI工具</span></h2>
        <p class="hero-subtitle">探索2024年最受欢迎的AI应用、大语言模型和开发工具</p>
        <div class="search-box">
          <input type="text" placeholder="搜索AI工具..." v-model="searchQuery" />
          <button class="search-btn">
            <el-icon><Search /></el-icon>
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">4,500+</span>
            <span class="stat-label">AI工具</span>
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
    
    // 模拟从Product Hunt获取的数据
    const data = [
      {
        name: "OpenAI",
        description: "构建AI产品的强大平台，由行业领先的模型和工具提供支持",
        image: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/openai-icon.svg",
        tags: ["AI基础设施", "开发工具", "大语言模型"],
        upvotes: 4324,
        comments: 71,
        rating: 4.6
      },
      {
        name: "ChatGPT",
        description: "获取答案，寻找灵感，提高生产力的AI助手",
        image: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg",
        tags: ["聊天机器人", "大语言模型", "AI助手"],
        upvotes: 3985,
        comments: 759,
        rating: 4.7
      },
      {
        name: "Claude",
        description: "一系列基础性AI模型，可靠、可解释、可控",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg",
        tags: ["大语言模型", "AI助手", "聊天机器人"],
        upvotes: 3254,
        comments: 100,
        rating: 4.8
      },
      {
        name: "Anthropic",
        description: "Anthropic AI研究公司旨在构建可靠、可解释和可控的AI系统",
        image: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.png",
        tags: ["AI基础设施", "大语言模型", "AI研究"],
        upvotes: 2854,
        comments: 8,
        rating: 4.5
      },
      {
        name: "ElevenLabs",
        description: "即时创建任何语言的自然AI语音",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/ElevenLabs_logo_%282022-2024%29.png",
        tags: ["文本转语音", "AI声音", "创作工具"],
        upvotes: 2543,
        comments: 49,
        rating: 4.8
      },
      {
        name: "Langchain",
        description: "LangChain的产品套件支持AI开发",
        image: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/langchain.svg",
        tags: ["AI基础设施", "开发工具", "大语言模型"],
        upvotes: 2345,
        comments: 4,
        rating: 5.0
      },
      {
        name: "Gemini",
        description: "Google对GPT-4的回应",
        image: "https://ph-files.imgix.net/99b3e788-14c7-4bbb-97ea-d87c23c9318f.png?auto=format",
        tags: ["大语言模型", "AI助手", "谷歌AI"],
        upvotes: 2123,
        comments: 40,
        rating: 4.5
      },
      {
        name: "Llama",
        description: "Meta的开源LLM家族",
        image: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/meta-llama.svg",
        tags: ["大语言模型", "开源AI", "Meta AI"],
        upvotes: 1976,
        comments: 16,
        rating: 4.8
      },
      {
        name: "Intercom",
        description: "AI优先的客户支持平台",
        image: "https://ph-files.imgix.net/d5eb104d-b62a-4bbd-9d14-4586287d4a6c.png?auto=format",
        tags: ["客户支持", "聊天机器人", "AI助手"],
        upvotes: 1754,
        comments: 567,
        rating: 4.3
      },
      {
        name: "Deepgram",
        description: "为开发者设计的语音AI平台",
        image: "https://ph-files.imgix.net/d8569aff-15af-4d9e-8095-08c1d1d3e0fa.png?auto=format",
        tags: ["语音AI", "文本转语音", "AI语音代理"],
        upvotes: 1650,
        comments: 22,
        rating: 4.4
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
        rating: item.rating
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
  router.push({ name: 'product-detail', params: { id: productId } });
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