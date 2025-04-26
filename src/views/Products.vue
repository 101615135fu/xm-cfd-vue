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
              <img :src="product.image || 'https://ph-files.imgix.net/ada2695b-e20b-4c1b-b04a-e0fbd9daf466.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=1'" :alt="product.name">
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
                      <img :src="item.image" :alt="item.name">
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
    image: 'https://ph-files.imgix.net/ada2695b-e20b-4c1b-b04a-e0fbd9daf466.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=1',
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
      'https://ph-files.imgix.net/0b40ec79-541f-4676-a1cd-42ea8959cde9.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=400&h=220&fit=max&frame=1&dpr=1',
      'https://ph-files.imgix.net/64964b85-6408-4543-9276-2c447e484df4.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=363&h=220&fit=max&frame=1&dpr=1',
      'https://ph-files.imgix.net/d790b507-ead3-4c97-8773-0a2f29420b23.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=363&h=220&fit=max&frame=1&dpr=1'
    ],
    comments: [
      {
        user: '张三',
        avatar: 'https://ph-avatars.imgix.net/677204/4bd64add-426a-417a-b89f-436c8f78e1bb.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1',
        date: '2023-05-20',
        text: '这是我用过的最好的AI编程工具，大大提高了我的开发效率！',
        likes: 24
      },
      {
        user: '李四',
        avatar: 'https://ph-avatars.imgix.net/7577871/original.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1',
        date: '2023-05-18',
        text: '代码解释功能非常实用，帮助我快速理解了一个复杂的开源项目。',
        likes: 18
      },
      {
        user: '王五',
        avatar: 'https://ph-avatars.imgix.net/8282445/2656dc69-2fa9-4d58-83d5-f31a8079f256.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1',
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
      image: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png'
    },
    {
      id: 'codeium',
      name: 'Codeium',
      tagline: '免费的AI编程助手，提供代码补全和生成功能',
      image: 'https://codeium.com/favicon.png'
    },
    {
      id: 'tabnine',
      name: 'Tabnine',
      tagline: 'AI代码助手，支持多种编程语言和IDE',
      image: 'https://www.tabnine.com/icons/icon-192x192.png'
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
  .product-detail {
    background-color: #0a0a16;
    color: #e0e0ff;
    min-height: 100vh;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  /* 顶部导航 */
  .top-nav {
    border-bottom: 1px solid rgba(64, 153, 255, 0.2);
    padding: 18px 0;
    background-color: rgba(14, 14, 30, 0.7);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 25px rgba(0, 140, 255, 0.15);
  }
  
  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .back-link .el-button {
    color: #e0e0ff;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .back-link .el-button:hover {
    color: #4099ff;
    transform: translateX(-3px);
  }
  
  .nav-actions {
    display: flex;
    gap: 15px;
  }
  
  .action-btn {
    color: #a0aace;
    transition: all 0.3s ease;
  }
  
  .action-btn:hover {
    color: #e0e0ff;
    transform: translateY(-2px);
  }
  
  /* 产品头部 */
  .product-header {
    padding: 60px 0;
    background: linear-gradient(135deg, rgba(5, 12, 32, 0.9) 0%, rgba(15, 22, 52, 0.9) 100%);
    border-bottom: 1px solid rgba(64, 153, 255, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  .product-header::before {
    content: '';
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
  
  .product-header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 40px;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  .product-image {
    width: 120px;
    height: 120px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(64, 153, 255, 0.3);
    position: relative;
  }
  
  .product-image::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 10px rgba(64, 153, 255, 0.2);
    border-radius: 16px;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-title {
    font-size: 40px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px 0;
    background: linear-gradient(90deg, #e0e0ff, #b5b8ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }
  
  .product-tagline {
    font-size: 20px;
    color: rgba(224, 224, 255, 0.9);
    margin: 0 0 20px 0;
    line-height: 1.5;
  }
  
  .product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
  }
  
  .product-tag {
    background-color: rgba(114, 0, 255, 0.1) !important;
    border-color: rgba(114, 0, 255, 0.2) !important;
    color: rgba(224, 224, 255, 0.9) !important;
    font-size: 12px !important;
    padding: 6px 12px !important;
    border-radius: 6px !important;
    transition: all 0.3s ease;
  }
  
  .product-tag:hover {
    background-color: rgba(114, 0, 255, 0.2) !important;
    transform: translateY(-2px);
  }
  
  .product-actions {
    display: flex;
    gap: 15px;
  }
  
  .visit-btn {
    background: linear-gradient(135deg, #4099ff, #704eff) !important;
    border: none !important;
    padding: 12px 25px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    box-shadow: 0 5px 15px rgba(64, 153, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .visit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(64, 153, 255, 0.4);
  }
  
  .upvote-btn {
    background-color: rgba(64, 153, 255, 0.1) !important;
    border-color: rgba(64, 153, 255, 0.3) !important;
    color: #4099ff !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    padding: 12px 20px !important;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .upvote-btn:hover {
    background-color: #4099ff !important;
    color: white !important;
    box-shadow: 0 0 15px rgba(64, 153, 255, 0.4);
    transform: translateY(-2px);
  }
  
  .product-meta {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .meta-item {
    text-align: right;
    background-color: rgba(64, 153, 255, 0.08);
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid rgba(64, 153, 255, 0.15);
    transition: all 0.3s ease;
  }
  
  .meta-item:hover {
    background-color: rgba(64, 153, 255, 0.12);
    transform: translateY(-2px);
  }
  
  .meta-label {
    font-size: 12px;
    color: rgba(224, 224, 255, 0.6);
    margin-bottom: 6px;
  }
  
  .meta-value {
    font-size: 15px;
    font-weight: 600;
    color: #e0e0ff;
  }
  
  /* 产品内容区域 */
  .product-content {
    padding: 60px 0;
    position: relative;
  }
  
  .product-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 10% 10%, rgba(0, 106, 255, 0.03) 0%, transparent 60%),
                      radial-gradient(circle at 90% 90%, rgba(94, 0, 255, 0.03) 0%, transparent 60%);
    z-index: 0;
  }
  
  .content-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    position: relative;
    z-index: 1;
  }
  
  .content-section {
    margin-bottom: 50px;
    background-color: rgba(15, 18, 36, 0.4);
    border-radius: 16px;
    padding: 30px;
    border: 1px solid rgba(64, 153, 255, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .content-section:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 0 15px rgba(64, 153, 255, 0.1);
    transform: translateY(-3px);
    border-color: rgba(64, 153, 255, 0.2);
  }
  
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(64, 153, 255, 0.15);
    background: linear-gradient(90deg, #e0e0ff, #b5b8ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .product-description {
    font-size: 16px;
    line-height: 1.7;
    color: rgba(224, 224, 255, 0.9);
  }
  
  .product-description p {
    margin-bottom: 15px;
  }
  
  /* 产品特点 */
  .features-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  
  .feature-item {
    display: flex;
    gap: 20px;
    padding: 15px;
    border-radius: 12px;
    background-color: rgba(64, 153, 255, 0.05);
    border: 1px solid rgba(64, 153, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background-color: rgba(64, 153, 255, 0.08);
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    color: #00e676;
    font-size: 20px;
    margin-top: 3px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 230, 118, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .feature-title {
    font-size: 18px;
    font-weight: 600;
    color: #e0e0ff;
    margin: 0 0 8px 0;
  }
  
  .feature-description {
    font-size: 15px;
    color: rgba(224, 224, 255, 0.8);
    margin: 0;
    line-height: 1.6;
  }
  
  /* 产品截图 */
  .screenshots {
    margin-top: 20px;
  }
  
  .screenshot-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  /* 用户评论 */
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-bottom: 40px;
  }
  
  .comment-item {
    display: flex;
    gap: 20px;
    padding: 20px;
    border-radius: 12px;
    background-color: rgba(64, 153, 255, 0.05);
    border: 1px solid rgba(64, 153, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .comment-item:hover {
    background-color: rgba(64, 153, 255, 0.08);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .comment-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(64, 153, 255, 0.3);
    flex-shrink: 0;
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
    margin-bottom: 10px;
  }
  
  .comment-user {
    font-weight: 600;
    color: #e0e0ff;
    font-size: 16px;
  }
  
  .comment-date {
    font-size: 14px;
    color: rgba(224, 224, 255, 0.6);
  }
  
  .comment-text {
    font-size: 15px;
    line-height: 1.6;
    color: rgba(224, 224, 255, 0.9);
    margin-bottom: 15px;
  }
  
  .comment-actions {
    display: flex;
    gap: 15px;
  }
  
  .comment-actions .el-button {
    color: rgba(224, 224, 255, 0.7);
    transition: all 0.3s ease;
  }
  
  .comment-actions .el-button:hover {
    color: #4099ff;
    transform: translateY(-2px);
  }
  
  .add-comment {
    margin-top: 30px;
  }
  
  .comment-form-title {
    font-size: 20px;
    font-weight: 600;
    color: #e0e0ff;
    margin-bottom: 20px;
  }
  
  .comment-form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .comment-form-actions .el-button {
    background: linear-gradient(135deg, #4099ff, #704eff) !important;
    border: none !important;
    padding: 10px 25px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    box-shadow: 0 5px 15px rgba(64, 153, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .comment-form-actions .el-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(64, 153, 255, 0.4);
  }
  
  /* 侧边栏 */
  .sidebar-section {
    background-color: rgba(15, 18, 36, 0.4);
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 30px;
    border: 1px solid rgba(64, 153, 255, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .sidebar-section:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 0 15px rgba(64, 153, 255, 0.1);
    transform: translateY(-3px);
    border-color: rgba(64, 153, 255, 0.2);
  }
  
  .sidebar-title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 20px 0;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(64, 153, 255, 0.15);
    background: linear-gradient(90deg, #e0e0ff, #b5b8ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* 相关链接 */
  .links-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .product-link {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(224, 224, 255, 0.8);
    text-decoration: none;
    font-size: 15px;
    padding: 12px 15px;
    border-radius: 8px;
    background-color: rgba(64, 153, 255, 0.05);
    border: 1px solid rgba(64, 153, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .product-link:hover {
    background-color: rgba(64, 153, 255, 0.1);
    color: #fff;
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* 相似产品 */
  .similar-products {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .similar-product-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    border-radius: 10px;
    background-color: rgba(64, 153, 255, 0.05);
    border: 1px solid rgba(64, 153, 255, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .similar-product-item:hover {
    background-color: rgba(64, 153, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .similar-product-image {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }
  
  .similar-product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .similar-product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .similar-product-name {
    font-weight: 600;
    color: #e0e0ff;
    margin-bottom: 5px;
    font-size: 16px;
  }
  
  .similar-product-tagline {
    font-size: 14px;
    color: rgba(224, 224, 255, 0.7);
    line-height: 1.4;
  }
  
  /* 产品统计 */
  .stats-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .stats-list .stat-item {
    text-align: center;
    background-color: rgba(64, 153, 255, 0.05);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid rgba(64, 153, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .stats-list .stat-item:hover {
    background-color: rgba(64, 153, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .stats-list .stat-label {
    font-size: 14px;
    color: rgba(224, 224, 255, 0.6);
    margin-bottom: 8px;
  }
  
  .stats-list .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #4099ff;
    background: linear-gradient(90deg, #4099ff, #704eff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
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