<template>
    <div class="category-page">
      <div class="hero-section">
        <div class="hero-bg-overlay"></div>
        <div class="container">
          <h2 class="hero-title">发现最佳<span class="highlight">AI编程工具</span></h2>
          <p class="hero-subtitle">探索提升开发效率的AI编程助手、代码生成器和开发工具</p>
          <div class="search-box">
            <input type="text" placeholder="搜索AI编程工具..." v-model="searchQuery" />
            <button class="search-btn">搜索</button>
          </div>
        </div>
      </div>
  
      <!-- 筛选和排序 -->
      <div class="filter-section">
        <div class="container">
          <div class="filter-options">
            <div class="filter-group">
              <span class="filter-label">排序:</span>
              <el-select v-model="sortOption" placeholder="热门" size="small">
                <el-option label="热门" value="popular"></el-option>
                <el-option label="最新" value="newest"></el-option>
                <el-option label="评分最高" value="highest_rated"></el-option>
              </el-select>
            </div>
            <div class="filter-group">
              <span class="filter-label">时间:</span>
              <el-select v-model="timeOption" placeholder="全部时间" size="small">
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
            <el-button plain>加载更多</el-button>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  // 获取分类参数
  const categoryName = ref(route.params.category || 'ai-coding');
  
  // 产品数据
  const products = ref([]);
  const isLoading = ref(false);
  
  // 搜索和筛选状态
  const searchQuery = ref('');
  const sortOption = ref('popular');
  const timeOption = ref('all_time');
  const tags = ref(['AI编程', '代码生成', '代码补全', '开发工具', '免费工具', '多语言支持', 'AWS', '云开发', '在线IDE']);
  const selectedTags = ref([]);
  
  // 切换标签选择
  const toggleTag = (tag) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter(t => t !== tag);
    } else {
      selectedTags.value.push(tag);
    }
  };
  
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
      // 假设有评分字段，这里用upvotes代替
      result = [...result].sort((a, b) => b.upvotes - a.upvotes);
    }
    
    return result;
  });
  
  // 导航到产品详情页
  const navigateToProduct = (productId) => {
    router.push({ name: 'product-detail', params: { id: productId } });
  };
  
  // 加载数据
  const loadData = async () => {
    try {
      isLoading.value = true;
      
      // 模拟从API加载数据
      // 实际应用中，这里应该调用后端API获取数据
      setTimeout(() => {
        products.value = [
          {
            id: 'github-copilot',
            name: "GitHub Copilot",
            description: "AI编程助手，可以根据注释和上下文生成代码",
            image: "https://github.githubassets.com/images/modules/site/copilot/copilot.png",
            tags: ["AI编程", "代码生成", "开发工具"],
            upvotes: 2543,
            comments: 127
          },
          {
            id: 'cursor',
            name: "Cursor",
            description: "基于AI的代码编辑器，帮助开发者更快地编写和理解代码",
            image: "https://assets-global.website-files.com/617825a38a48f37525a3c16f/62f38118f8125c80f89cb066_Cursor%20App%20Icon.jpg",
            tags: ["代码编辑器", "AI编程", "开发工具"],
            upvotes: 1876,
            comments: 93
          },
          {
            id: 'codeium',
            name: "Codeium",
            description: "免费的AI编程助手，提供代码补全和生成功能",
            image: "https://codeium.com/favicon.png",
            tags: ["AI编程", "代码补全", "免费工具"],
            upvotes: 1245,
            comments: 78
          },
          {
            id: 'tabnine',
            name: "Tabnine",
            description: "AI代码助手，支持多种编程语言和IDE",
            image: "https://www.tabnine.com/icons/icon-192x192.png",
            tags: ["AI编程", "代码补全", "多语言支持"],
            upvotes: 1102,
            comments: 65
          },
          {
            id: 'codewhisperer',
            name: "CodeWhisperer",
            description: "Amazon的AI编程助手，为AWS开发者提供代码建议",
            image: "https://d1.awsstatic.com/Amazon%20CodeWhisperer/Amazon-CodeWhisperer-Icon_48.604b2b2118cbdc0d3da943eb384302a0e4a6843f.png",
            tags: ["AI编程", "AWS", "云开发"],
            upvotes: 987,
            comments: 54
          },
          {
            id: 'replit-ghostwriter',
            name: "Replit Ghostwriter",
            description: "Replit平台的AI编程助手，帮助开发者快速编写代码",
            image: "https://replit.com/public/icons/ghost-128.png",
            tags: ["AI编程", "在线IDE", "代码生成"],
            upvotes: 856,
            comments: 42
          }
        ];
        isLoading.value = false;
      }, 500);
      
    } catch (error) {
      console.error('加载数据失败:', error);
      isLoading.value = false;
    }
  };
  
  // 组件挂载时加载数据
  onMounted(() => {
    loadData();
  });
  </script>
  
  <style scoped>
  .category-page {
    background-color: #0a0a16;
    color: #e0e0ff;
    min-height: 100vh;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  /* 英雄部分样式 */
  .hero-section {
    background: linear-gradient(135deg, #050c20 0%, #0f1634 100%);
    padding: 100px 0 80px;
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
    font-size: 42px;
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
    font-size: 20px;
    color: rgba(224, 224, 255, 0.9);
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;
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
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  .search-btn:hover {
    background: linear-gradient(90deg, #0066ff, #8c00ff);
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
  
  .upvote-btn {
    background-color: rgba(64, 153, 255, 0.1) !important;
    border-color: rgba(64, 153, 255, 0.3) !important;
    color: #4099ff !important;
    font-weight: 600 !important;
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
  
  /* 响应式设计 */
  @media (min-width: 768px) {
    .products-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (min-width: 992px) {
    .product-card {
      padding: 28px 32px;
    }
  }
  </style>