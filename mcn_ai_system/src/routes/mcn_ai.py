from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.services.ai_service import AIModelService
import json
import random
import os
from datetime import datetime, timedelta

mcn_ai_bp = Blueprint('mcn_ai', __name__)

# 初始化AI服务
# 在生产环境中，应该从环境变量读取API密钥
ai_service = AIModelService(api_key=os.getenv('GEMINI_API_KEY'))

# 模拟数据
# 扩展后的 MOCK_CREATORS 列表，保持不变
MOCK_CREATORS = [
    {
        "id": 1,
        "name": "小美美妆",
        "category": "美妆",
        "followers": 125000,
        "engagement_rate": 8.5,  # 这个字段在前端显示时将被“粉丝契合度”替换
        "avg_views": 45000,
        "potential_score": 92,
        "growth_trend": "上升",
        "platforms": ["抖音", "小红书", "B站"],
        "style": "活泼、时尚",
        "tags": ["美妆", "护肤", "时尚穿搭"],
        "past_collaborations": "品牌A、品牌B"
    },
    {
        "id": 2,
        "name": "科技小王",
        "category": "科技",
        "followers": 89000,
        "engagement_rate": 12.3,
        "avg_views": 78000,
        "potential_score": 88,
        "growth_trend": "稳定",
        "platforms": ["B站", "抖音"],
        "style": "专业、深度",
        "tags": ["科技", "数码", "测评"],
        "past_collaborations": "品牌C、品牌D"
    },
    {
        "id": 3,
        "name": "美食达人",
        "category": "美食",
        "followers": 156000,
        "engagement_rate": 6.8,
        "avg_views": 32000,
        "potential_score": 75,
        "growth_trend": "下降",
        "platforms": ["抖音", "快手", "小红书"],
        "style": "亲和、实用",
        "tags": ["美食", "探店", "家常菜"],
        "past_collaborations": "品牌E、品牌F"
    },
    {
        "id": 4,
        "name": "旅行家张",
        "category": "旅行",
        "followers": 230000,
        "engagement_rate": 9.1,
        "avg_views": 60000,
        "potential_score": 95,
        "growth_trend": "上升",
        "platforms": ["小红书", "B站", "微博"],
        "style": "治愈、风景",
        "tags": ["旅行", "户外", "vlog", "攻略"],
        "past_collaborations": "航空公司X、酒店集团Y"
    },
    {
        "id": 5,
        "name": "健康生活家",
        "category": "健康",
        "followers": 75000,
        "engagement_rate": 10.5,
        "avg_views": 38000,
        "potential_score": 80,
        "growth_trend": "稳定",
        "platforms": ["抖音", "小红书"],
        "style": "专业、实用",
        "tags": ["健身", "营养", "瑜伽", "健康饮食"],
        "past_collaborations": "健身房A、保健品B"
    },
    {
        "id": 6,
        "name": "时尚穿搭姐",
        "category": "时尚",
        "followers": 180000,
        "engagement_rate": 7.2,
        "avg_views": 55000,
        "potential_score": 90,
        "growth_trend": "上升",
        "platforms": ["抖音", "小红书"],
        "style": "高级、简约",
        "tags": ["穿搭", "时尚", "ootd", "奢侈品"],
        "past_collaborations": "品牌D、品牌E"
    },
    {
        "id": 7,
        "name": "萌宠乐园",
        "category": "萌宠",
        "followers": 95000,
        "engagement_rate": 15.0,
        "avg_views": 85000,
        "potential_score": 85,
        "growth_trend": "稳定",
        "platforms": ["抖音", "快手"],
        "style": "可爱、有趣",
        "tags": ["萌宠", "猫咪", "狗狗", "宠物用品"],
        "past_collaborations": "宠物粮品牌F、宠物玩具G"
    },
    {
        "id": 8,
        "name": "二次元动漫宅",
        "category": "动漫",
        "followers": 60000,
        "engagement_rate": 11.0,
        "avg_views": 40000,
        "potential_score": 70,
        "growth_trend": "稳定",
        "platforms": ["B站", "微博"],
        "style": "幽默、热血",
        "tags": ["动漫", "游戏", "二次元", "手办"],
        "past_collaborations": "游戏公司H、动漫周边I"
    }
]

# 扩展后的 MOCK_BRANDS 列表，保持不变
MOCK_BRANDS = [
    {
        "id": 1,
        "name": "时尚品牌A",
        "category": "时尚",
        "description": "专注于年轻潮流服饰。",
        "budget": 500000,
        "target_audience": "18-35岁女性，追求时尚与个性",
        "campaign_type": "品牌推广",
        "products_services": "时尚服饰、潮流配饰",
        "requirements": "粉丝量10万+，互动率5%+，时尚穿搭类创作者"
    },
    {
        "id": 2,
        "name": "科技公司B",
        "category": "科技",
        "description": "领先的智能硬件和软件解决方案提供商。",
        "budget": 800000,
        "target_audience": "25-40岁男性，关注前沿科技",
        "campaign_type": "产品发布",
        "products_services": "智能手机、笔记本电脑、智能家居",
        "requirements": "科技垂直领域，粉丝量5万+，能进行专业评测和深度解读"
    },
    {
        "id": 3,
        "name": "美妆品牌C",
        "category": "美妆",
        "description": "提供高端护肤品和彩妆产品。",
        "budget": 600000,
        "target_audience": "20-45岁女性，注重护肤和彩妆品质",
        "campaign_type": "新品上市",
        "products_services": "精华液、口红、粉底",
        "requirements": "美妆垂类，粉丝量8万+，内容精致，有产品深度评测能力"
    },
    {
        "id": 4,
        "name": "旅游服务商D",
        "category": "旅行",
        "description": "专注于全球特色旅行线路和定制服务。",
        "budget": 400000,
        "target_audience": "25-50岁，热爱旅行，追求独特体验的人群",
        "campaign_type": "目的地推广",
        "products_services": "欧洲游、海岛度假、定制小团",
        "requirements": "旅行博主，粉丝量15万+，vlog制作精良，善于分享旅行体验"
    },
    {
        "id": 5,
        "name": "宠物用品E",
        "category": "萌宠",
        "description": "生产高品质宠物食品和玩具。",
        "budget": 300000,
        "target_audience": "养猫狗的年轻家庭，关注宠物健康和生活品质",
        "campaign_type": "品牌曝光",
        "products_services": "猫粮、狗粮、智能喂食器、宠物玩具",
        "requirements": "萌宠博主，粉丝量5万+，内容有趣，善于与宠物互动"
    },
    {
        "id": 6,
        "name": "健康食品F",
        "category": "健康",
        "description": "提供天然有机健康食品。",
        "budget": 350000,
        "target_audience": "关注健康、健身、有机生活的人群",
        "campaign_type": "产品试用",
        "products_services": "蛋白粉、坚果、燕麦片",
        "requirements": "健康/健身博主，粉丝量6万+，分享健康食谱或健身日常"
    }
]


@mcn_ai_bp.route('/creators', methods=['GET'])
@cross_origin()
def get_creators():
    """获取创作者列表"""
    category = request.args.get('category', '')
    min_followers = request.args.get('min_followers', 0, type=int)

    filtered_creators = MOCK_CREATORS
    if category:
        filtered_creators = [c for c in filtered_creators if c['category'] == category]
    if min_followers:
        filtered_creators = [c for c in filtered_creators if c['followers'] >= min_followers]

    return jsonify({
        "success": True,
        "data": filtered_creators,
        "total": len(filtered_creators)
    })


@mcn_ai_bp.route('/creators/<int:creator_id>/analytics', methods=['GET'])
@cross_origin()
def get_creator_analytics(creator_id):
    """获取创作者数据分析"""
    # 生成模拟的30天数据
    analytics_data = []
    base_date = datetime.now() - timedelta(days=30)

    for i in range(30):
        date = base_date + timedelta(days=i)
        analytics_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "views": random.randint(20000, 80000),
            "likes": random.randint(1000, 8000),
            "comments": random.randint(100, 800),
            "shares": random.randint(50, 500),
            "followers_growth": random.randint(-100, 500)
        })

    return jsonify({
        "success": True,
        "data": {
            "creator_id": creator_id,
            "analytics": analytics_data,
            "summary": {
                "total_views": sum(d["views"] for d in analytics_data),
                "avg_engagement_rate": round(random.uniform(5.0, 15.0), 2),
                "follower_growth": sum(d["followers_growth"] for d in analytics_data)
            }
        }
    })


@mcn_ai_bp.route('/content/generate', methods=['POST'])
@cross_origin()
def generate_content():
    """AI内容生成 - 使用真实AI模型"""
    data = request.get_json()
    topic = data.get('topic', '')
    content_type = data.get('type', 'post')
    platform = data.get('platform', '抖音')

    if not topic:
        return jsonify({"success": False, "message": "主题不能为空"}), 400

    try:
        # 调用AI服务生成内容
        result = ai_service.generate_content(topic, content_type)

        if result.get('success'):
            # 添加平台特定的预测数据
            result['data'] = {
                **result['content'],
                "platform": platform,
                "estimated_performance": {
                    "predicted_views": random.randint(10000, 100000),
                    "predicted_engagement": round(random.uniform(3.0, 12.0), 2)
                }
            }
            # 删除原始的 'content' 键，因为它的内容已经被展开到 'data' 中了
            del result['content']
            return jsonify(result)
        else:
            return jsonify({"success": False, "message": result.get('message', '内容生成失败')}), 500

    except Exception as e:
        print(f"[generate_content] 路由异常: {type(e).__name__}, 详情: {e}")
        return jsonify({"success": False, "message": f"内容生成失败: {str(e)}"}), 500


@mcn_ai_bp.route('/matching/brand-creator', methods=['POST'])
@cross_origin()
def match_brand_creator():
    """品牌-创作者智能匹配 - 使用真实AI模型"""
    data = request.get_json()
    print(f"接收到的请求数据 (data): {data}")  # 用于调试

    brand_id = data.get('brand_id')
    brand_requirements_from_request = data.get('brand_requirements')
    selected_platform = data.get('platform')  # 获取前端传来的平台参数

    final_brand_info = None

    if brand_requirements_from_request:
        if isinstance(brand_requirements_from_request, dict):
            final_brand_info = brand_requirements_from_request
        elif isinstance(brand_requirements_from_request, list) and brand_requirements_from_request:
            final_brand_info = brand_requirements_from_request[0]

    if not final_brand_info and brand_id:
        final_brand_info = next((b for b in MOCK_BRANDS if b['id'] == brand_id), None)
        if final_brand_info and 'brand_requirements' in data and isinstance(data['brand_requirements'], dict):
            final_brand_info.update(data['brand_requirements'])

    if not final_brand_info:
        return jsonify({"success": False, "message": "无法找到或接收到品牌信息"}), 400

    # 根据平台筛选创作者
    filtered_creators = MOCK_CREATORS
    if selected_platform:
        # 筛选出在指定平台有账号的创作者
        filtered_creators = [
            c for c in MOCK_CREATORS
            if selected_platform.lower() in [p.lower() for p in c.get('platforms', [])]
        ]
        print(f"根据平台 '{selected_platform}' 筛选后，剩余创作者数量: {len(filtered_creators)}")
        if not filtered_creators:
            return jsonify({"success": False, "message": f"没有找到在 '{selected_platform}' 平台活跃的创作者。"}), 404

    try:
        # 调用AI服务进行智能匹配，传递筛选后的创作者列表
        result = ai_service.smart_match(final_brand_info, filtered_creators)

        if result.get('success'):
            return jsonify({
                "success": True,
                "data": {
                    "brand": final_brand_info,
                    "matched_creators": result['match_result'],
                    "total_matches": len(result['match_result'])
                }
            })
        else:
            return jsonify({"success": False, "message": result.get('message', "匹配失败")}), 500

    except Exception as e:
        print(f"[match_brand_creator] 路由异常: {type(e).__name__}, 详情: {e}")
        return jsonify({"success": False, "message": f"匹配失败: {str(e)}"}), 500


@mcn_ai_bp.route('/risk/content-check', methods=['POST'])
@cross_origin()
def check_content_risk():
    """内容风险检测 - 使用真实AI模型"""
    data = request.get_json()
    content = data.get('content', '')

    if not content:
        return jsonify({"success": False, "message": "内容不能为空"}), 400

    try:
        # 调用AI服务进行风险检测
        result = ai_service.detect_risk(content)

        if result.get('success'):
            risk_assessment = result['risk_assessment']

            # 转换为前端期望的格式
            risk_level_map = {"低": 0, "中": 1, "高": 2}
            risk_score = risk_level_map.get(risk_assessment.get('overall_risk', '低'), 0) * 30 + random.randint(0, 30)

            return jsonify({
                "success": True,
                "data": {
                    "risk_level": risk_assessment.get('overall_risk', '低'),
                    "risk_score": risk_score,
                    "issues": [
                        f"政治敏感性: {risk_assessment.get('political_sensitivity', {}).get('reason', '')}",
                        f"法律合规性: {risk_assessment.get('legal_compliance', {}).get('reason', '')}",
                        f"道德伦理: {risk_assessment.get('ethical_concerns', {}).get('reason', '')}"
                    ],
                    "suggestions": risk_assessment.get('suggestions', [])
                }
            })
        else:
            return jsonify({"success": False, "message": result.get('message', '风险检测失败')}), 500

    except Exception as e:
        print(f"[check_content_risk] 路由异常: {type(e).__name__}, 详情: {e}")
        return jsonify({"success": False, "message": f"风险检测失败: {str(e)}"}), 500


@mcn_ai_bp.route('/dashboard/overview', methods=['GET'])
@cross_origin()
def get_dashboard_overview():
    """获取仪表板概览数据"""
    return jsonify({
        "success": True,
        "data": {
            "total_creators": len(MOCK_CREATORS),
            "active_campaigns": 12,
            "total_revenue": 2580000,
            "avg_roi": 4.2,
            "platform_distribution": {
                "抖音": 45,
                "小红书": 25,
                "B站": 20,
                "快手": 10
            },
            "category_distribution": {
                "美妆": 30,
                "科技": 25,
                "美食": 20,
                "时尚": 15,
                "其他": 10
            },
            "recent_activities": [
                {"time": "2小时前", "action": "新增创作者", "detail": "小美美妆"},
                {"time": "4小时前", "action": "完成匹配", "detail": "时尚品牌A × 3位创作者"},
                {"time": "6小时前", "action": "内容审核", "detail": "通过15条内容"},
                {"time": "8小时前", "action": "数据分析", "detail": "生成月度报告"}
            ]
        }
    })


# 新增：AI模型状态检查接口
@mcn_ai_bp.route('/ai/status', methods=['GET'])
@cross_origin()
def get_ai_status():
    """获取AI模型状态"""
    return jsonify({
        "success": True,
        "data": {
            "model_status": "运行中" if ai_service.model else "使用模拟数据",
            "api_key_configured": bool(os.getenv('GEMINI_API_KEY')),
            "available_features": [
                "内容生成",
                "智能匹配",
                "风险检测"
            ]
        }
    })