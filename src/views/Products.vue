<template>
    <div class="product-detail">
      <!-- 顶部导航 -->
      <div class="top-nav">
        <div class="container">
          <div class="nav-content">
            <div class="back-link">
              <el-button type="text" @click="goBack">
                <i class="el-icon-arrow-left"></i> 返回
              </el-button>
            </div>
            <div class="nav-actions">
              <el-button type="text" class="action-btn">
                <i class="el-icon-share"></i> 分享
              </el-button>
              <el-button type="text" class="action-btn">
                <i class="el-icon-star-off"></i> 收藏
              </el-button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 产品头部信息 -->
      <div class="product-header">
        <div class="container">
          <div class="product-header-content">
            <div class="product-image">
              <img :src="product.image || 'https://via.placeholder.com/120'" :alt="product.name">
            </div>
            <div class="product-header-info">
              <h1 class="product-title">{{ product.name }}</h1>
              <p class="product-tagline">{{ product.tagline }}</p>
              <div class="product-tags">
                <el-tag v-for="tag in product.tags" :key="tag" size="small" effect="plain" class="product-tag">
                  {{ tag }}
                </el-tag>
              </div>
              <div class="product-actions">
                <el-button type="primary" class="visit-btn" @click="visitWebsite">
                  访问网站
                </el-button>
                <el-button class="upvote-btn">
                  <i class="el-icon-caret-top"></i> {{ product.upvotes || 0 }}
                </el-button>
              </div>
            </div>
            <div class="product-meta">
              <div class="meta-item">
                <div class="meta-label">发布日期</div>
                <div class="meta-value">{{ product.launchDate }}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">价格</div>
                <div class="meta-value">{{ product.pricing }}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">制作者</div>
                <div class="meta-value">{{ product.maker }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 产品内容区域 -->
      <div class="product-content">
        <div class="container">
          <div class="content-layout">
            <!-- 左侧主要内容 -->
            <div class="main-content">
              <!-- 产品介绍 -->
              <div class="content-section">
                <h2 class="section-title">关于 {{ product.name }}</h2>
                <div class="product-description" v-html="product.description"></div>
              </div>
  
              <!-- 产品特点 -->
              <div class="content-section">
                <h2 class="section-title">主要特点</h2>
                <div class="features-list">
                  <div v-for="(feature, index) in product.features" :key="index" class="feature-item">
                    <div class="feature-icon">
                      <i class="el-icon-check"></i>
                    </div>
                    <div class="feature-content">
                      <h3 class="feature-title">{{ feature.title }}</h3>
                      <p class="feature-description">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 产品截图 -->
              <div class="content-section">
                <h2 class="section-title">产品截图</h2>
                <div class="screenshots">
                  <el-carousel :interval="4000" type="card" height="400px">
                    <el-carousel-item v-for="(screenshot, index) in product.screenshots" :key="index">
                      <img :src="screenshot" :alt="`${product.name} 截图 ${index + 1}`" class="screenshot-img">
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
  
              <!-- 用户评论 -->
              <div class="content-section">
                <h2 class="section-title">用户评论 ({{ product.comments.length }})</h2>
                <div class="comments-list">
                  <div v-for="(comment, index) in product.comments" :key="index" class="comment-item">
                    <div class="comment-avatar">
                      <img :src="comment.avatar || 'https://via.placeholder.com/40'" :alt="comment.user">
                    </div>
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-user">{{ comment.user }}</span>
                        <span class="comment-date">{{ comment.date }}</span>
                      </div>
                      <div class="comment-text">{{ comment.text }}</div>
                      <div class="comment-actions">
                        <el-button type="text" size="small">
                          <i class="el-icon-chat-dot-round"></i> 回复
                        </el-button>
                        <el-button type="text" size="small">
                          <i class="el-icon-thumb"></i> 点赞 ({{ comment.likes || 0 }})
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 添加评论 -->
                <div class="add-comment">
                  <h3 class="comment-form-title">添加评论</h3>
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="分享您对这个产品的看法..."
                    v-model="newComment"
                  ></el-input>
                  <div class="comment-form-actions">
                    <el-button type="primary">提交评论</el-button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- 右侧边栏 -->
            <div class="sidebar">
              <!-- 相关链接 -->
              <div class="sidebar-section">
                <h3 class="sidebar-title">相关链接</h3>
                <div class="links-list">
                  <a v-for="(link, index) in product.links" :key="index" :href="link.url" target="_blank" class="product-link">
                    <i :class="getLinkIcon(link.type)"></i> {{ link.label }}
                  </a>
                </div>
              </div>
  
              <!-- 相似产品 -->
              <div class="sidebar-section">
                <h3 class="sidebar-title">相似产品</h3>
                <div class="similar-products">
                  <div v-for="(item, index) in similarProducts" :key="index" class="similar-product-item">
                    <div class="similar-product-image">
                      <img :src="item.image || 'https://via.placeholder.com/50'" :alt="item.name">
                    </div>
                    <div class="similar-product-info">
                      <div class="similar-product-name">{{ item.name }}</div>
                      <div class="similar-product-tagline">{{ item.tagline }}</div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- 产品统计 -->
              <div class="sidebar-section">
                <h3 class="sidebar-title">产品统计</h3>
                <div class="stats-list">
                  <div class="stat-item">
                    <div class="stat-label">点赞数</div>
                    <div class="stat-value">{{ product.upvotes || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">评论数</div>
                    <div class="stat-value">{{ product.comments.length }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">收藏数</div>
                    <div class="stat-value">{{ product.saves || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">浏览量</div>
                    <div class="stat-value">{{ product.views || 0 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  const newComment = ref('');
  
  // 获取路由参数中的产品ID
  const productId = ref(route.params.id);
  
  // 模拟从Excel文件加载的产品详情数据
  const product = ref({
    id: 'cursor',
    name: 'Cursor',
    tagline: '基于AI的代码编辑器，帮助开发者更快地编写和理解代码',
    image: 'https://ph-files.imgix.net/a3a6b51c-d233-4d5d-a64d-9e1b6b96d17c.png?auto=format',
    description: `<p>Cursor是一款革命性的代码编辑器，它集成了强大的AI功能，帮助开发者更快地编写、理解和调试代码。</p>
    <p>Cursor基于OpenAI的GPT-4模型，能够理解代码上下文，提供智能代码补全、代码解释和重构建议。它不仅可以帮助您编写新代码，还可以帮助您理解和修改现有代码库。</p>
    <p>无论您是经验丰富的开发者还是初学者，Cursor都能显著提高您的编码效率和代码质量。</p>`,
    tags: ['AI编程', '代码编辑器', '开发工具', 'GPT-4'],
    upvotes: 1876,
    launchDate: '2023-03-15',
    pricing: '免费版 + 付费订阅',
    maker: 'Cursor团队',
    features: [
      {
        title: 'AI代码生成',
        description: '只需描述您想要实现的功能，Cursor就能生成相应的代码。'
      },
      {
        title: '智能代码补全',
        description: '基于上下文的智能代码补全，比传统的自动补全更加准确和有用。'
      },
      {
        title: '代码解释',
        description: '选中任何代码片段，Cursor可以用通俗易懂的语言解释其功能。'
      },
      {
        title: '代码重构',
        description: '自动识别可以改进的代码，并提供重构建议。'
      },
      {
        title: '多语言支持',
        description: '支持JavaScript、Python、Java、C++等多种编程语言。'
      }
    ],
    screenshots: [
      'https://ph-files.imgix.net/d5b76304-7d9a-4d9c-b449-ef9e8c0ff1a2.png?auto=format',
      'https://ph-files.imgix.net/b8f8c83d-c842-4a8c-a73f-a5a8d2e9b7c1.png?auto=format',
      'https://ph-files.imgix.net/e6c0a4d8-9f9c-4972-8a59-c7f76b7e3a3c.png?auto=format'
    ],
    comments: [
      {
        user: '张三',
        avatar: 'https://via.placeholder.com/40',
        date: '2023-05-20',
        text: '这是我用过的最好的AI编程工具，大大提高了我的开发效率！',
        likes: 24
      },
      {
        user: '李四',
        avatar: 'https://via.placeholder.com/40',
        date: '2023-05-18',
        text: '代码解释功能非常实用，帮助我快速理解了一个复杂的开源项目。',
        likes: 18
      },
      {
        user: '王五',
        avatar: 'https://via.placeholder.com/40',
        date: '2023-05-15',
        text: '免费版已经很强大了，但是付费版的功能更加丰富，值得升级。',
        likes: 12
      }
    ],
    links: [
      {
        type: 'website',
        label: '官方网站',
        url: 'https://cursor.sh'
      },
      {
        type: 'github',
        label: 'GitHub',
        url: 'https://github.com/getcursor/cursor'
      },
      {
        type: 'twitter',
        label: 'Twitter',
        url: 'https://twitter.com/cursor_ai'
      },
      {
        type: 'youtube',
        label: '视频演示',
        url: 'https://www.youtube.com/watch?v=example'
      }
    ],
    saves: 543,
    views: 12567
  });
  
  // 相似产品
  const similarProducts = ref([
    {
      id: 'github-copilot',
      name: 'GitHub Copilot',
      tagline: 'AI编程助手，可以根据注释和上下文生成代码',
      image: 'https://ph-files.imgix.net/b7c1e0e7-bda6-4d7d-9348-82a23cc4e3fd.png?auto=format'
    },
    {
      id: 'codeium',
      name: 'Codeium',
      tagline: '免费的AI编程助手，提供代码补全和生成功能',
      image: 'https://ph-files.imgix.net/e6af34e1-a038-4978-b1f6-3d68e162ed74.png?auto=format'
    },
    {
      id: 'tabnine',
      name: 'Tabnine',
      tagline: 'AI代码助手，支持多种编程语言和IDE',
      image: 'https://ph-files.imgix.net/2e7e2f78-f57c-4f76-b3e3-e3a8d2dc0e39.png?auto=format'
    }
  ]);
  
  // 根据链接类型获取图标
  const getLinkIcon = (type) => {
    const iconMap = {
      website: 'el-icon-link',
      github: 'el-icon-s-custom',
      twitter: 'el-icon-s-promotion',
      youtube: 'el-icon-video-camera',
      default: 'el-icon-link'
    };
    return iconMap[type] || iconMap.default;
  };
  
  // 访问网站
  const visitWebsite = () => {
    if (product.value.links && product.value.links.length > 0) {
      const websiteLink = product.value.links.find(link => link.type === 'website');
      if (websiteLink) {
        window.open(websiteLink.url, '_blank');
      }
    }
  };
  
  // 返回上一页
  const goBack = () => {
    router.back();
  };
  
  // 跳转到相似产品详情页
  const navigateToSimilarProduct = (productId) => {
    router.push({ name: 'product-detail', params: { id: productId } });
  };
  
  // 从Excel文件加载数据
  onMounted(() => {
    console.log('加载产品ID:', productId.value);
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  /* 顶部导航 */
  .top-nav {
    border-bottom: 1px solid #eaeaea;
    padding: 15px 0;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-actions {
    display: flex;
    gap: 15px;
  }
  
  .action-btn {
    color: #4a5568;
  }
  
  /* 产品头部 */
  .product-header {
    padding: 40px 0;
    background-color: #f5f8fa;
    border-bottom: 1px solid #eaeaea;
  }
  
  .product-header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 30px;
    align-items: center;
  }
  
  .product-image {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-title {
    font-size: 32px;
    font-weight: 700;
    color: #0a2540;
    margin: 0 0 8px 0;
  }
  
  .product-tagline {
    font-size: 18px;
    color: #4a5568;
    margin: 0 0 16px 0;
  }
  
  .product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .product-tag {
    font-size: 12px;
  }
  
  .product-actions {
    display: flex;
    gap: 12px;
  }
  
  .visit-btn {
    background-color: #ff6154;
    border-color: #ff6154;
  }
  
  .upvote-btn {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .product-meta {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .meta-item {
    text-align: right;
  }
  
  .meta-label {
    font-size: 12px;
    color: #718096;
    margin-bottom: 4px;
  }
  
  .meta-value {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
  }
  
  /* 产品内容区域 */
  .product-content {
    padding: 40px 0;
  }
  
  .content-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
  }
  
  .content-section {
    margin-bottom: 40px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: #0a2540;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .product-description {
    font-size: 16px;
    line-height: 1.6;
    color: #4a5568;
  }
  
  /* 产品特点 */
  .features-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .feature-item {
    display: flex;
    gap: 15px;
  }
  
  .feature-icon {
    color: #10b981;
    font-size: 20px;
    margin-top: 3px;
  }
  
  .feature-title {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
  }
  
  .feature-description {
    font-size: 14px;
    color: #4a5568;
    margin: 0;
  }
  
  /* 产品截图 */
  .screenshots {
    margin-top: 20px;
  }
  
  .screenshot-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  /* 用户评论 */
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .comment-item {
    display: flex;
    gap: 15px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .comment-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .comment-content {
    flex: 1;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .comment-user {
    font-weight: 600;
    color: #2d3748;
  }
  
  .comment-date {
    font-size: 12px;
    color: #718096;
  }
  
  .comment-text {
    font-size: 14px;
    line-height: 1.5;
    color: #4a5568;
    margin-bottom: 12px;
  }
  
  .comment-actions {
    display: flex;
    gap: 15px;
  }
  
  .add-comment {
    margin-top: 30px;
  }
  
  .comment-form-title {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 15px;
  }
  
  .comment-form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  
  /* 侧边栏 */
  .sidebar-section {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
  }
  
  .sidebar-title {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
  }
  
  /* 相关链接 */
  .links-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .product-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #3182ce;
    text-decoration: none;
    font-size: 14px;
  }
  
  .product-link:hover {
    text-decoration: underline;
  }
  
  /* 相似产品 */
  .similar-products {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .similar-product-item {
    display: flex;
    gap: 12px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .similar-product-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .similar-product-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .similar-product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .similar-product-info {
    flex: 1;
  }
  
  .similar-product-name {
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 4px;
  }
  
  .similar-product-tagline {
    font-size: 12px;
    color: #718096;
  }
  
  /* 产品统计 */
  .stats-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-label {
    font-size: 12px;
    color: #718096;
    margin-bottom: 4px;
  }
  
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #2d3748;
  }
  
  /* 响应式设计 */
  @media (max-width: 992px) {
    .content-layout {
      grid-template-columns: 1fr;
    }
    
    .product-header-content {
      grid-template-columns: auto 1fr;
    }
    
    .product-meta {
      grid-column: span 2;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 20px;
    }
  }
  
  @media (max-width: 768px) {
    .product-header-content {
      grid-template-columns: 1fr;
      text-align: center;
    }
    
    .product-image {
      margin: 0 auto;
    }
    
    .product-actions {
      justify-content: center;
    }
    
    .product-meta {
      grid-column: 1;
      justify-content: center;
    }
    
    .meta-item {
      text-align: center;
    }
  }
  </style>