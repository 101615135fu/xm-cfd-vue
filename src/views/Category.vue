<template>
    <div class="category-page">
      <div class="hero-section">
        <div class="container">
          <h2 class="hero-title">发现最佳AI编程工具</h2>
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
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-tags">
                  <el-tag v-for="tag in product.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
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
            image: "https://ph-files.imgix.net/b7c1e0e7-bda6-4d7d-9348-82a23cc4e3fd.png?auto=format",
            tags: ["AI编程", "代码生成", "开发工具"],
            upvotes: 2543,
            comments: 127
          },
          {
            id: 'cursor',
            name: "Cursor",
            description: "基于AI的代码编辑器，帮助开发者更快地编写和理解代码",
            image: "https://ph-files.imgix.net/a3a6b51c-d233-4d5d-a64d-9e1b6b96d17c.png?auto=format",
            tags: ["代码编辑器", "AI编程", "开发工具"],
            upvotes: 1876,
            comments: 93
          },
          {
            id: 'codeium',
            name: "Codeium",
            description: "免费的AI编程助手，提供代码补全和生成功能",
            image: "https://ph-files.imgix.net/e6af34e1-a038-4978-b1f6-3d68e162ed74.png?auto=format",
            tags: ["AI编程", "代码补全", "免费工具"],
            upvotes: 1245,
            comments: 78
          },
          {
            id: 'tabnine',
            name: "Tabnine",
            description: "AI代码助手，支持多种编程语言和IDE",
            image: "https://ph-files.imgix.net/2e7e2f78-f57c-4f76-b3e3-e3a8d2dc0e39.png?auto=format",
            tags: ["AI编程", "代码补全", "多语言支持"],
            upvotes: 1102,
            comments: 65
          },
          {
            id: 'codewhisperer',
            name: "CodeWhisperer",
            description: "Amazon的AI编程助手，为AWS开发者提供代码建议",
            image: "https://ph-files.imgix.net/d1a51e2e-5f56-4c91-a4c3-5a5a8939e6f5.png?auto=format",
            tags: ["AI编程", "AWS", "云开发"],
            upvotes: 987,
            comments: 54
          },
          {
            id: 'replit-ghostwriter',
            name: "Replit Ghostwriter",
            description: "Replit平台的AI编程助手，帮助开发者快速编写代码",
            image: "https://ph-files.imgix.net/f9e77f1b-5a5d-4b8e-a94a-9d1f8a9a5cb4.png?auto=format",
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
  /* 英雄部分样式 */
  .hero-section {
    background-color: #f5f8fa;
    padding: 60px 0;
    text-align: center;
  }
  
  .hero-title {
    font-size: 32px;
    color: #0a2540;
    margin-bottom: 16px;
    font-weight: 700;
  }
  
  .hero-subtitle {
    font-size: 18px;
    color: #4a5568;
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
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
    background-color: #ff6154;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-weight: 500;
  }
  
  /* 筛选部分样式 */
  .filter-section {
    padding: 20px 0;
    border-bottom: 1px solid #eaeaea;
  }
  
  .filter-options {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    margin-right: 24px;
  }
  
  .filter-label {
    margin-right: 8px;
    color: #4a5568;
  }
  
  .tags-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .filter-tag {
    cursor: pointer;
  }
  
  /* 产品列表样式 */
  .products-section {
    padding: 40px 0;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .product-card {
    display: flex;
    padding: 24px;
    border-radius: 8px;
    border: 1px solid #eaeaea;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }
  
  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .product-image {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-info {
    flex: 1;
  }
  
  .product-name {
    font-size: 18px;
    font-weight: 600;
    color: #0a2540;
    margin-bottom: 8px;
  }
  
  .product-description {
    color: #4a5568;
    margin-bottom: 12px;
    font-size: 14px;
  }
  
  .product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .product-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    min-width: 100px;
  }
  
  .upvote-btn {
    border-color: #ff6154;
    color: #ff6154;
  }
  
  .upvote-btn:hover {
    background-color: #ff6154;
    color: white;
  }
  
  .product-comments {
    font-size: 14px;
    color: #718096;
  }
  
  .load-more {
    text-align: center;
    margin-top: 40px;
  }
  
  /* 响应式设计 */
  @media (min-width: 768px) {
    .products-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (min-width: 992px) {
    .product-card {
      padding: 24px 32px;
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  </style>