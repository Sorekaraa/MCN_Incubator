import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, TrendingUp, DollarSign, Activity, Search, Sparkles, Shield, BarChart3, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import './App.css'

const API_BASE_URL = 'http://127.0.0.1:8000/api/mcn'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [creators, setCreators] = useState([])
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [creatorAnalytics, setCreatorAnalytics] = useState(null)
  const [contentGeneration, setContentGeneration] = useState({
    type: 'title',
    topic: '',
    platform: '抖音',
    result: null
  })

  const [brandMatching, setBrandMatching] = useState({
    brandId: '', // 初始值为空，等待加载
    selectedPlatform: '所有平台', // 默认选中"所有平台"
    results: null
  })

  const [brands, setBrands] = useState([]); // 存储品牌列表，用于下拉选择

  const [riskCheck, setRiskCheck] = useState({
    content: '',
    result: null
  })

  // 可选平台列表
  const platforms = ["所有平台", "抖音", "小红书", "B站", "快手", "微博"];

  // 获取仪表板数据
  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/overview`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDashboardData(data.data)
          }
        })
        .catch(err => console.error('获取仪表板数据失败:', err))
  }, [])

  // 获取创作者列表
  useEffect(() => {
    fetch(`${API_BASE_URL}/creators`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCreators(data.data)
          }
        })
        .catch(err => console.error('获取创作者列表失败:', err))
  }, [])

  // 获取创作者分析数据
  const fetchCreatorAnalytics = (creatorId) => {
    fetch(`${API_BASE_URL}/creators/${creatorId}/analytics`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCreatorAnalytics(data.data)
          }
        })
        .catch(err => console.error('获取创作者分析数据失败:', err))
  }

  // 生成内容
  const generateContent = () => {
    if (!contentGeneration.topic.trim()) {
      alert('请输入内容主题')
      return
    }

    fetch(`${API_BASE_URL}/content/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: contentGeneration.type,
        topic: contentGeneration.topic,
        platform: contentGeneration.platform
      })
    })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setContentGeneration(prev => ({ ...prev, result: data.data }))
          } else {
            alert('内容生成失败: ' + (data.message || '未知错误'))
          }
        })
        .catch(err => {
          console.error('内容生成失败:', err)
          alert('内容生成失败，请检查网络连接')
        })
  }

  // 获取品牌列表
  useEffect(() => {
    // 假设您已经有一个 /api/mcn/brands 接口返回品牌列表
    const availableBrands = [
      { id: 1, name: "时尚品牌A", category: "时尚", description: "专注于年轻潮流服饰。", budget: 500000, target_audience: "18-35岁女性，追求时尚与个性", campaign_type: "品牌推广", products_services: "时尚服饰、潮流配饰", requirements: "粉丝量10万+，互动率5%+，时尚穿搭类创作者" },
      { id: 2, name: "科技公司B", category: "科技", description: "领先的智能硬件和软件解决方案提供商。", budget: 800000, target_audience: "25-40岁男性，关注前沿科技", campaign_type: "产品发布", products_services: "智能手机、笔记本电脑、智能家居", requirements: "科技垂直领域，粉丝量5万+，能进行专业评测和深度解读" },
      { id: 3, name: "美妆品牌C", category: "美妆", description: "提供高端护肤品和彩妆产品。", budget: 600000, target_audience: "20-45岁女性，注重护肤和彩妆品质", campaign_type: "新品上市", products_services: "精华液、口红、粉底", requirements: "美妆垂类，粉丝量8万+，内容精致，有产品深度评测能力" },
      { id: 4, name: "旅游服务商D", category: "旅行", description: "专注于全球特色旅行线路和定制服务。", budget: 400000, target_audience: "25-50岁，热爱旅行，追求独特体验的人群", campaign_type: "目的地推广", products_services: "欧洲游、海岛度假、定制小团", requirements: "旅行博主，粉丝量15万+，vlog制作精良，善于分享旅行体验" },
      { id: 5, name: "宠物用品E", category: "萌宠", description: "生产高品质宠物食品和玩具。", budget: 300000, target_audience: "养猫狗的年轻家庭，关注宠物健康和生活品质", campaign_type: "品牌曝光", products_services: "猫粮、狗粮、智能喂食器、宠物玩具", requirements: "萌宠博主，粉丝量5万+，内容有趣，善于与宠物互动" },
      { id: 6, name: "健康食品F", category: "健康", description: "提供天然有机健康食品。", budget: 350000, target_audience: "关注健康、健身、有机生活的人群", campaign_type: "产品试用", products_services: "蛋白粉、坚果、燕麦片", requirements: "健康/健身博主，粉丝量6万+，分享健康食谱或健身日常" }
    ];
    setBrands(availableBrands);
    if (availableBrands.length > 0) {
      setBrandMatching(prev => ({ ...prev, brandId: availableBrands[0].id }));
    }
  }, []);

  // 品牌匹配
  const performBrandMatching = () => {
    // 找到当前选择的品牌对象
    const currentBrand = brands.find(b => b.id === brandMatching.brandId);
    if (!currentBrand) {
      alert('请选择一个品牌。');
      return;
    }

    const payload = {
      brand_id: brandMatching.brandId,
      brand_requirements: currentBrand
    };

    // 如果选择了特定平台（并且不是“所有平台”），则添加到 Payload
    if (brandMatching.selectedPlatform && brandMatching.selectedPlatform !== "所有平台") {
      payload.platform = brandMatching.selectedPlatform;
    }

    console.log("Sending matching payload:", payload); // 调试用

    fetch(`${API_BASE_URL}/matching/brand-creator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // 后端已排序，直接设置结果
            setBrandMatching(prev => ({ ...prev, results: data.data }))
          } else {
            alert('品牌匹配失败: ' + (data.message || '未知错误'))
          }
        })
        .catch(err => {
          console.error('品牌匹配失败:', err)
          alert('品牌匹配失败，请检查网络连接或后端服务')
        })
  }

  // 风险检测
  const checkContentRisk = () => {
    if (!riskCheck.content.trim()) {
      alert('请输入要检测的内容')
      return
    }

    fetch(`${API_BASE_URL}/risk/content-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: riskCheck.content
      })
    })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRiskCheck(prev => ({ ...prev, result: data.data }))
          } else {
            alert('风险检测失败: ' + (data.message || '未知错误'))
          }
        })
        .catch(err => {
          console.error('风险检测失败:', err)
          alert('风险检测失败，请检查网络连接')
        })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center mr-6">
                  <ArrowLeft className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500">返回首页</span>
                </Link>
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">MCN AI 智能管理系统</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Beta 版本</Badge>
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">仪表板</TabsTrigger>
              <TabsTrigger value="creators">创作者管理</TabsTrigger>
              <TabsTrigger value="content">内容生成</TabsTrigger>
              <TabsTrigger value="matching">智能匹配</TabsTrigger>
              <TabsTrigger value="risk">风险检测</TabsTrigger>
            </TabsList>

            {/* 仪表板 */}
            <TabsContent value="dashboard" className="space-y-6">
              {dashboardData && (
                  <>
                    {/* 统计卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">总创作者数</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dashboardData.total_creators}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">活跃营销活动</CardTitle>
                          <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dashboardData.active_campaigns}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">总收入</CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">¥{(dashboardData.total_revenue / 10000).toFixed(1)}万</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">平均ROI</CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dashboardData.avg_roi}x</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 图表 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>平台分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                  data={Object.entries(dashboardData.platform_distribution).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                              >
                                {Object.entries(dashboardData.platform_distribution).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>内容类别分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={Object.entries(dashboardData.category_distribution).map(([name, value]) => ({ name, value }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 最近活动 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>最近活动</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.recent_activities.map((activity, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{activity.action}</p>
                                  <p className="text-xs text-gray-500">{activity.detail}</p>
                                </div>
                                <div className="text-xs text-gray-400">{activity.time}</div>
                              </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
              )}
            </TabsContent>

            {/* 创作者管理 */}
            <TabsContent value="creators" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>创作者列表</CardTitle>
                    <CardDescription>管理和分析创作者数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {creators.map((creator) => (
                          <div
                              key={creator.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                  selectedCreator?.id === creator.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => {
                                setSelectedCreator(creator)
                                fetchCreatorAnalytics(creator.id)
                              }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{creator.name}</h3>
                                <p className="text-sm text-gray-500">{creator.category}</p>
                                <div className="flex space-x-2 mt-2">
                                  {creator.platforms.map((platform) => (
                                      <Badge key={platform} variant="secondary" className="text-xs">
                                        {platform}
                                      </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{(creator.followers / 10000).toFixed(1)}万粉丝</p>
                                {/* 这里的互动率保持不变，因为这是创作者自身的属性，
                                粉丝契合度是品牌匹配的产物 */}
                                <p className="text-xs text-gray-500">互动率 {creator.engagement_rate}%</p>
                                <Badge variant={creator.growth_trend === '上升' ? 'default' : creator.growth_trend === '稳定' ? 'secondary' : 'destructive'}>
                                  {creator.growth_trend}
                                </Badge>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>创作者分析</CardTitle>
                    <CardDescription>
                      {selectedCreator ? `${selectedCreator.name} 的数据分析` : '请选择一个创作者查看分析'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {creatorAnalytics ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{(creatorAnalytics.summary.total_views / 10000).toFixed(1)}万</p>
                              <p className="text-sm text-gray-500">总播放量</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{creatorAnalytics.summary.avg_engagement_rate}%</p>
                              <p className="text-sm text-gray-500">平均互动率</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{creatorAnalytics.summary.follower_growth}</p>
                              <p className="text-sm text-gray-500">粉丝增长</p>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={creatorAnalytics.analytics.slice(-7)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" tickFormatter={(value) => value.slice(-5)} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="views" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>选择创作者查看详细分析</p>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 内容生成 */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    AI 内容生成
                  </CardTitle>
                  <CardDescription>使用AI技术生成高质量的内容标题、脚本等</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">内容类型</label>
                      <Select value={contentGeneration.type} onValueChange={(value) => setContentGeneration(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title">标题</SelectItem>
                          <SelectItem value="script">脚本</SelectItem>
                          <SelectItem value="description">描述</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">平台</label>
                      <Select value={contentGeneration.platform} onValueChange={(value) => setContentGeneration(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="抖音">抖音</SelectItem>
                          <SelectItem value="小红书">小红书</SelectItem>
                          <SelectItem value="B站">B站</SelectItem>
                          <SelectItem value="快手">快手</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">主题</label>
                      <Input
                          placeholder="输入内容主题"
                          value={contentGeneration.topic}
                          onChange={(e) => setContentGeneration(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={generateContent} disabled={!contentGeneration.topic}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    生成内容
                  </Button>
                  {contentGeneration.result && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">生成结果：</h4>
                        <div className="space-y-3">
                          {contentGeneration.result.title && (
                              <div>
                                <span className="font-medium text-blue-600">标题：</span>
                                <p className="mt-1">{contentGeneration.result.title}</p>
                              </div>
                          )}
                          {contentGeneration.result.description && (
                              <div>
                                <span className="font-medium text-green-600">描述：</span>
                                <p className="mt-1">{contentGeneration.result.description}</p>
                              </div>
                          )}
                          {contentGeneration.result.script && (
                              <div>
                                <span className="font-medium text-purple-600">脚本：</span>
                                <p className="mt-1 whitespace-pre-wrap">{contentGeneration.result.script}</p>
                              </div>
                          )}
                          {contentGeneration.result.tags && (
                              <div>
                                <span className="font-medium text-orange-600">标签：</span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {contentGeneration.result.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline">{tag}</Badge>
                                  ))}
                                </div>
                              </div>
                          )}
                          {contentGeneration.result.content && !contentGeneration.result.title && (
                              <div>
                                <span className="font-medium">内容：</span>
                                <p className="mt-1 whitespace-pre-wrap">{contentGeneration.result.content}</p>
                              </div>
                          )}
                        </div>
                        {contentGeneration.result.estimated_performance && (
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm border-t pt-4">
                              <div>
                                <span className="font-medium">预测播放量：</span>
                                {contentGeneration.result.estimated_performance.predicted_views.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">预测互动率：</span>
                                {contentGeneration.result.estimated_performance.predicted_engagement}%
                              </div>
                            </div>
                        )}
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 智能匹配 */}
            <TabsContent value="matching" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    品牌-创作者智能匹配
                  </CardTitle>
                  <CardDescription>基于AI算法为品牌推荐最适合的创作者</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label htmlFor="brand-select" className="text-sm font-medium">选择品牌</label>
                      <Select
                          value={brandMatching.brandId.toString()}
                          onValueChange={(value) => setBrandMatching(prev => ({ ...prev, brandId: parseInt(value) }))}
                      >
                        <SelectTrigger id="brand-select">
                          <SelectValue placeholder="选择一个品牌" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map(brand => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                {brand.name}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <label htmlFor="platform-select" className="text-sm font-medium">选择平台</label>
                      <Select
                          value={brandMatching.selectedPlatform}
                          onValueChange={(value) => setBrandMatching(prev => ({ ...prev, selectedPlatform: value }))}
                      >
                        <SelectTrigger id="platform-select">
                          <SelectValue placeholder="选择平台" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map(platform => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={performBrandMatching} className="self-end pb-2">
                      <Search className="h-4 w-4 mr-2" />
                      开始匹配
                    </Button>
                  </div>

                  {brandMatching.results && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-4">匹配结果：</h4>
                        <div className="space-y-4">
                          {brandMatching.results.matched_creators.map((match, index) => (
                              <div key={match.id || index} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium">{match.name}</h5>
                                    <p className="text-sm text-gray-500">{match.category}</p>
                                    {/* 粉丝契合度：移除 '%' */}
                                    <p className="text-sm">
                                      {(match.followers / 10000).toFixed(1)}万粉丝 ·
                                      {match.fan_affinity} 契合度
                                    </p>
                                    <div className="flex space-x-2 mt-2">
                                      {match.platforms && match.platforms.map((platform) => (
                                          <Badge key={platform} variant="secondary" className="text-xs">
                                            {platform}
                                          </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {/* 在Badge上方显示匹配度文字和数字，移除 '%' */}

                                    <Badge
                                        variant={
                                          // 新的颜色逻辑
                                          match.match_details.match_percentage > 10 ? 'default' : // 大于50 绿色
                                              (match.match_details.match_percentage >= 5 && match.match_details.match_percentage <= 10) ? 'blue' : // 30-50 蓝色 (假设 'blue' 变体存在或映射到 'secondary' 颜色)
                                                  'destructive' // 小于30 红色
                                        }
                                        className="mb-2"
                                    >
                                      {/** 注意：这里需要确保您的 `Badge` 组件支持自定义颜色变体，或者将 'blue' 映射到 Shadcn UI 中现有的 'secondary' 或其他预设颜色。
                                       * 如果您使用的是 Shadcn UI 默认配置，可能需要修改 `components/ui/badge.jsx` 或 `tailwind.config.js` 来定义 'blue' 变体。
                                       * 暂时我将 'blue' 映射到 'secondary'，因为 Shadcn UI 默认不提供 'blue' 变体。如果您有定制的 Badge 组件，请自行调整。
                                       */}
                                      匹配度 {match.match_details.match_percentage} {/* 移除 '%' */}
                                    </Badge>
                                    {match.match_details.reason && (
                                        <p className="text-sm text-gray-600">理由: {match.match_details.reason}</p>
                                    )}
                                    {match.match_details.suggestions && match.match_details.suggestions !== "无" && (
                                        <p className="text-sm text-green-600">建议: {match.match_details.suggestions}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                          ))}
                          {brandMatching.results.matched_creators.length === 0 && (
                              <p className="text-center text-gray-500">根据当前筛选条件，没有找到匹配的创作者。</p>
                          )}
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 风险检测 */}
            <TabsContent value="risk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    内容风险检测
                  </CardTitle>
                  <CardDescription>AI自动检测内容合规性和潜在风险</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">内容文本</label>
                    <Textarea
                        placeholder="输入需要检测的内容..."
                        value={riskCheck.content}
                        onChange={(e) => setRiskCheck(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                    />
                  </div>
                  <Button onClick={checkContentRisk} disabled={!riskCheck.content}>
                    <Shield className="h-4 w-4 mr-2" />
                    检测风险
                  </Button>
                  {riskCheck.result && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">检测结果</h4>
                          <Badge variant={riskCheck.result.risk_level === '低' ? 'default' : riskCheck.result.risk_level === '中' ? 'secondary' : 'destructive'}>
                            风险等级：{riskCheck.result.risk_level}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p><span className="font-medium">风险评分：</span>{riskCheck.result.risk_score}/100</p>
                          {riskCheck.result.issues.length > 0 && (
                              <div>
                                <p className="font-medium">发现问题：</p>
                                <ul className="list-disc list-inside text-sm text-red-600">
                                  {riskCheck.result.issues.map((issue, index) => (
                                      <li key={index}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                          )}
                          <div>
                            <p className="font-medium">建议：</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {riskCheck.result.suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}

export default Dashboard