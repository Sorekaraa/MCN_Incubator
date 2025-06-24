import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, TrendingUp, DollarSign, Activity, Sparkles, Shield, Search, BarChart3, CheckCircle, Star, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroBanner from './assets/hero-banner.png'
import './App.css'

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-blue-600" />,
      title: "AI 内容生成",
      description: "智能生成高质量的标题、脚本和创意内容，提升创作效率10倍以上"
    },
    {
      icon: <Search className="h-8 w-8 text-green-600" />,
      title: "智能匹配系统",
      description: "基于AI算法精准匹配品牌与创作者，提高合作成功率和ROI"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "数据分析洞察",
      description: "跨平台数据整合分析，提供深度洞察和预测性建议"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "风险预警系统",
      description: "AI自动检测内容合规性，降低运营风险和法律风险"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "创作者孵化",
      description: "个性化成长路径规划，标准化网红孵化流程"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "自动化运营",
      description: "24/7智能客服和自动化任务管理，大幅降低运营成本"
    }
  ]

  const stats = [
    { label: "创作者管理", value: "10,000+", icon: <Users className="h-5 w-5" /> },
    { label: "内容生成", value: "1M+", icon: <Sparkles className="h-5 w-5" /> },
    { label: "匹配成功率", value: "95%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "成本节省", value: "70%", icon: <DollarSign className="h-5 w-5" /> }
  ]

  const benefits = [
    "替代传统MCN，降低70%运营成本",
    "AI驱动的精准匹配，提升95%合作成功率",
    "自动化内容生成，提高10倍创作效率",
    "跨平台数据整合，全方位业务洞察",
    "智能风险预警，确保合规运营",
    "24/7自动化服务，无需人工干预"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">MCN AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">功能特性</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">核心优势</a>
              <a href="#demo" className="text-gray-600 hover:text-blue-600 transition-colors">产品演示</a>
              <Button className="bg-blue-600 hover:bg-blue-700">
                立即体验
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="space-y-4">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  🚀 AI驱动的MCN革命
                </Badge>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  重新定义
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    内容创作
                  </span>
                  生态
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  基于人工智能技术的下一代MCN管理系统，为内容创作者和品牌方提供智能化、自动化的全链路解决方案。
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  <Link to="/dashboard" className="flex items-center">
                    开始免费试用
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3">
                  观看演示视频
                </Button>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {stat.icon}
                      <span className="text-2xl font-bold text-gray-900 ml-2">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src={heroBanner} 
                  alt="MCN AI System" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              强大的AI功能矩阵
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              集成最先进的人工智能技术，为MCN行业提供全方位的智能化解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                为什么选择MCN AI？
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                传统MCN面临的痛点，我们用AI技术一一解决
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                  了解更多详情
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
                <div className="text-gray-600">成本降低</div>
              </Card>
              <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">10x</div>
                <div className="text-gray-600">效率提升</div>
              </Card>
              <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">匹配成功率</div>
              </Card>
              <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">智能服务</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            准备好体验AI驱动的MCN管理了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            加入数千家企业的行列，让AI为您的内容生态赋能
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              立即开始免费试用
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              联系销售团队
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>免费试用</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-1" />
              <span>无需信用卡</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-300 mr-1" />
              <span>企业级安全</span>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold">MCN AI</span>
              </div>
              <p className="text-gray-400">
                重新定义内容创作生态的AI驱动平台
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">功能特性</a></li>
                <li><a href="#" className="hover:text-white transition-colors">定价方案</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API文档</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">公司</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">招聘信息</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">社区论坛</a></li>
                <li><a href="#" className="hover:text-white transition-colors">技术支持</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MCN AI. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

