# mcn_ai_system/src/services/ai_service.py
import google.generativeai as genai
import json
import os
from typing import Dict, List, Any
import random  # 确保导入 random 模块


class AIModelService:
    def __init__(self, api_key: str = None):
        """
        初始化AI模型服务
        """
        if api_key:
            print("[AIModelService] 使用真实 API KEY:", api_key[:6] + "..." if api_key else "None")
            try:
                genai.configure(api_key=api_key)

                # 尝试列出模型并选择一个支持 generateContent 的模型
                available_models = []
                try:
                    for m in genai.list_models():
                        if 'generateContent' in m.supported_generation_methods:
                            available_models.append(m.name)

                    selected_model_name = None
                    if available_models:
                        # 优先选择最新的、推荐的模型
                        if 'models/gemini-1.5-flash' in available_models:
                            selected_model_name = 'gemini-1.5-flash'
                        elif 'gemini-1.5-flash' in available_models:  # 兼容不带 'models/' 前缀的情况
                            selected_model_name = 'gemini-1.5-flash'
                        elif 'models/gemini-1.5-pro' in available_models:
                            selected_model_name = 'gemini-1.5-pro'
                        elif 'gemini-1.5-pro' in available_models:
                            selected_model_name = 'gemini-1.5-pro'
                        elif 'models/gemini-pro' in available_models:  # 次优先选择 gemini-pro (如果还没弃用)
                            selected_model_name = 'gemini-pro'
                        elif 'gemini-pro' in available_models:
                            selected_model_name = 'gemini-pro'
                        else:
                            # 如果上述模型都不可用，则选择列表中的第一个可用模型
                            selected_model_name = available_models[0].split('/')[-1]

                        self.model = genai.GenerativeModel(selected_model_name)
                        print(f"[AIModelService] 模型初始化成功，使用的模型: {self.model.model_name}")
                    else:
                        print("[AIModelService] 未找到任何支持 'generateContent' 方法的模型。")
                        self.model = None

                except Exception as e:
                    print(f"[AIModelService] 列出模型或选择模型失败: {e}")
                    self.model = None

            except Exception as e:
                print("[AIModelService] genai.configure 失败:", e)
                self.model = None
        else:
            print("[AIModelService] 没有检测到 API KEY，使用模拟数据")
            self.model = None

    def generate_content(self, topic: str, content_type: str = "post") -> Dict[str, Any]:
        print(f"[generate_content] 收到请求，topic: {topic}, type: {content_type}")

        if self.model:  # 确保模型已成功初始化
            try:
                prompt = self._build_content_prompt(topic, content_type)
                print("[generate_content] 使用的 prompt:\n", prompt)
                response = self.model.generate_content(prompt)

                # 检查response是否有text属性，有些情况下API可能会返回错误而没有text
                if hasattr(response, 'text') and response.text:
                    print("[generate_content] AI 响应内容:\n", response.text)
                    return {
                        "success": True,
                        "content": {
                            "title": self._extract_title(response.text),
                            "description": self._extract_description(response.text),
                            "script": self._extract_script(response.text),
                            "tags": self._extract_tags(response.text)
                        }
                    }
                else:
                    error_message = "AI 响应内容为空或格式不正确。"
                    if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                        error_message += f" 提示反馈: {response.prompt_feedback}"
                    print(f"[generate_content] {error_message}")
                    return {
                        "success": False,
                        "message": f"内容生成失败: {error_message}"
                    }

            except Exception as e:
                # 打印更详细的异常信息
                print(f"[generate_content] AI 内容生成异常: 类型={type(e).__name__}, 详情={e}")
                # 尝试从异常中提取更多信息，特别是对于API错误
                if hasattr(e, 'response') and hasattr(e.response, 'text'):
                    try:
                        error_details = json.loads(e.response.text)
                        print(f"[generate_content] API 错误详情: {error_details}")
                        return {
                            "success": False,
                            "message": f"内容生成失败: {error_details.get('error', {}).get('message', str(e))}"
                        }
                    except json.JSONDecodeError:
                        return {
                            "success": False,
                            "message": f"内容生成失败: API返回错误但无法解析: {e.response.text}"
                        }
                return {
                    "success": False,
                    "message": f"内容生成失败，请检查网络连接或API Key是否有效: {str(e)}"
                }
        else:
            print("[generate_content] 模型为 None，使用模拟内容")
            return self._get_mock_content(topic, content_type)

    def _build_content_prompt(self, topic: str, content_type: str) -> str:
        # 根据 content_type 调整提示词，使其更准确
        if content_type == "title":
            return f"""
            请为以下主题生成一个吸引人的标题：{topic}

            请按以下格式返回：
            标题：[生成一个吸引人的标题]

            要求：
            1. 标题要简洁有力，具有吸引力
            2. 10-30字
            3. 符合社交媒体传播特点
            """
        elif content_type == "post":
            return f"""
            请为以下主题生成社交媒体帖子内容：{topic}

            请按以下格式返回：
            标题：[生成一个吸引人的标题]
            描述：[生成一个简洁的描述，50-100字]
            脚本：[生成详细的内容脚本，200-500字]
            标签：[生成3-5个相关标签，用逗号分隔]

            要求：
            1. 内容要有创意且吸引人
            2. 符合社交媒体传播特点
            3. 语言生动有趣
            4. 适合目标受众
            """
        else:  # 默认或其他类型
            return f"""
            请为以下主题生成{content_type}内容：{topic}

            请按以下格式返回：
            标题：[生成一个吸引人的标题]
            描述：[生成一个简洁的描述，50-100字]
            脚本：[生成详细的内容脚本，200-500字]
            标签：[生成3-5个相关标签，用逗号分隔]

            要求：
            1. 内容要有创意且吸引人
            2. 符合社交媒体传播特点
            3. 语言生动有趣
            4. 适合目标受众
            """

    def _extract_title(self, text: str) -> str:
        for line in text.splitlines():
            if '标题' in line:
                # 尝试更健壮的提取，避免因为中文冒号或英文冒号导致问题
                parts = line.split('：')
                if len(parts) > 1:
                    return parts[-1].strip()
                else:
                    parts = line.split(':')  # 尝试英文冒号
                    if len(parts) > 1:
                        return parts[-1].strip()
        return "AI生成标题"

    def _extract_description(self, text: str) -> str:
        for line in text.splitlines():
            if '描述' in line:
                parts = line.split('：')
                if len(parts) > 1:
                    return parts[-1].strip()
                else:
                    parts = line.split(':')
                    if len(parts) > 1:
                        return parts[-1].strip()
        return "AI生成描述"

    def _extract_script(self, text: str) -> str:
        # 对于脚本，可能有多行，需要更复杂的提取逻辑
        # 简单处理：找到"脚本："或"Script:"后，取到下一个关键词或行尾
        lines = text.splitlines()
        script_found = False
        script_content = []
        for line in lines:
            if '脚本：' in line:
                script_found = True
                script_content.append(line.split('：')[-1].strip())
            elif 'Script:' in line:  # 英文
                script_found = True
                script_content.append(line.split(':')[-1].strip())
            elif script_found and not any(k in line for k in ['标题', '描述', '标签', 'Title', 'Description', 'Tags']):
                # 如果已经找到了脚本开头，并且当前行不包含其他关键词，则认为是脚本内容
                script_content.append(line.strip())
            elif script_found and any(k in line for k in ['标题', '描述', '标签', 'Title', 'Description', 'Tags']):
                # 遇到下一个关键词，停止收集脚本
                break
        return "\n".join(script_content).strip() if script_content else "AI生成脚本"

    def _extract_tags(self, text: str) -> List[str]:
        for line in text.splitlines():
            if '标签' in line:
                parts = line.split('：')
                if len(parts) > 1:
                    tags = parts[-1].strip()
                    return [tag.strip() for tag in tags.split(',') if tag.strip()]
                else:
                    parts = line.split(':')
                    if len(parts) > 1:
                        tags = parts[-1].strip()
                        return [tag.strip() for tag in tags.split(',') if tag.strip()]
        return ["AI", "生成", "标签"]

    def _get_mock_content(self, topic: str, content_type: str) -> Dict[str, Any]:
        # 模拟数据也根据 content_type 略微调整
        if content_type == "title":
            return {
                "success": True,
                "content": {
                    "title": f"【模拟】{topic} 的精彩标题",
                    "description": "",  # 标题类型没有描述
                    "script": "",  # 标题类型没有脚本
                    "tags": [topic, "模拟标题"]
                }
            }
        else:
            return {
                "success": True,
                "content": {
                    "title": f"【模拟】{topic} 的爆款内容",
                    "description": f"【模拟】关于 {topic} 的模拟描述内容，这是一段很吸引人的简介。",
                    "script": f"【模拟】这里是关于 {topic} 的模拟脚本，适合 {content_type} 内容展示。\n这是一个非常详细的脚本内容，可以包括开场白、主体内容和结束语，例如：大家好，今天我们来聊聊{topic}...",
                    "tags": [topic, "模拟", "内容", "AI"]
                }
            }

    # 修改后的 smart_match 方法，接收创作者列表
    def smart_match(self, brand_info: Dict[str, Any], creators: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        根据品牌信息，与给定的创作者列表进行智能匹配。
        对于每个创作者，构建一个Prompt让AI评估匹配度。
        """
        print(f"[smart_match] 收到品牌匹配请求，品牌: {brand_info.get('name', 'N/A')}")

        matched_results = []

        if self.model:
            for creator_info in creators:  # 遍历创作者列表
                try:
                    print(f"  - 正在匹配创作者: {creator_info.get('name', 'N/A')}")
                    # 构建一个用于匹配的Prompt
                    match_prompt = f"""
                    请根据以下品牌信息和创作者信息，评估该创作者与品牌的匹配度，并给出匹配理由。
                    要求：
                    1. 匹配度：高/中/低
                    2. 匹配理由：详细说明匹配或不匹配的原因。
                    3. 如果匹配度为中或高，请给出1-2点合作建议。

                    品牌信息：
                    品牌名称：{brand_info.get('name', '未知品牌')}
                    品牌描述：{brand_info.get('description', '无描述')}
                    目标受众：{brand_info.get('target_audience', '不明确')}
                    主要产品/服务：{brand_info.get('products_services', '不明确')}

                    创作者信息：
                    创作者名称：{creator_info.get('name', '未知创作者')}
                    创作者领域/标签：{', '.join(creator_info.get('tags', [])) if creator_info.get('tags') else '无标签'}
                    创作者风格：{creator_info.get('style', '不明确')}
                    粉丝数量：{creator_info.get('followers', '不明确')}
                    过往合作案例：{creator_info.get('past_collaborations', '无')}

                    请按以下格式返回：
                    匹配度：[高/中/低]
                    匹配理由：[详细说明匹配原因]
                    合作建议：[如果匹配度为中或高，请给出1-2点建议，否则写无]
                    """

                    # print("[smart_match] 使用的 prompt:\n", match_prompt) # 匹配多个创作者时，避免打印过多Prompt
                    response = self.model.generate_content(match_prompt)

                    if hasattr(response, 'text') and response.text:
                        # print(f"  - AI 响应内容 for {creator_info.get('name')}:\n", response.text) # 匹配多个创作者时，避免打印过多响应
                        parsed_result = self._parse_match_response(response.text)

                        # 将创作者信息与匹配结果合并
                        combined_result = {
                            **creator_info,  # 包含完整的创作者信息
                            "match_details": parsed_result  # AI评估的匹配度、理由、建议
                        }
                        matched_results.append(combined_result)
                    else:
                        error_message = "AI 响应内容为空或格式不正确。"
                        if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                            error_message += f" 提示反馈: {response.prompt_feedback}"
                        print(f"  - 创作者 {creator_info.get('name')} 匹配失败: {error_message}")
                        # 即使匹配失败，也将其加入结果，但标记为失败或提供默认信息
                        matched_results.append({
                            **creator_info,
                            "match_details": {
                                "match_score": "未知",
                                "reason": f"AI评估失败: {error_message}",
                                "suggestions": "无"
                            }
                        })

                except Exception as e:
                    print(
                        f"[smart_match] AI 匹配生成异常 for {creator_info.get('name')}: 类型={type(e).__name__}, 详情={e}")
                    # 在异常情况下，也要将创作者加入结果列表，避免遗漏
                    matched_results.append({
                        **creator_info,
                        "match_details": {
                            "match_score": "未知",
                            "reason": f"匹配过程出错: {str(e)}",
                            "suggestions": "无"
                        }
                    })

            # 您可能需要在这里对 matched_results 进行排序，例如按匹配度高低
            # 示例：按匹配度从高到低排序 (高 > 中 > 低)
            score_order = {"高": 3, "中": 2, "低": 1, "未知": 0}
            matched_results.sort(key=lambda x: score_order.get(x['match_details']['match_score'], 0), reverse=True)

            return {
                "success": True,
                "match_result": matched_results  # 返回所有创作者的匹配结果列表
            }
        else:
            print("[smart_match] 模型为 None，使用模拟匹配结果")
            return self._get_mock_match_result(brand_info, creators)  # 调整这里，传入整个创作者列表

    def _parse_match_response(self, text: str) -> Dict[str, Any]:
        """
        解析AI返回的匹配结果文本。您需要根据Prompt中定义的返回格式来编写此解析逻辑。
        这是一个示例解析器。
        """
        result = {
            "match_score": "未知",
            "reason": "AI未能解析匹配理由。",
            "suggestions": "无"
        }
        lines = text.splitlines()
        for line in lines:
            if '匹配度：' in line:
                result['match_score'] = line.split('：')[-1].strip()
            elif '匹配理由：' in line:
                result['reason'] = line.split('：')[-1].strip()
            elif '合作建议：' in line:
                result['suggestions'] = line.split('：')[-1].strip()
        return result

    # 模拟匹配结果也需要调整，以匹配新的智能匹配函数签名
    def _get_mock_match_result(self, brand_info: Dict[str, Any], creators: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        当模型不可用时，返回模拟的匹配结果列表。
        """
        mock_results = []
        for creator_info in creators:
            mock_results.append({
                **creator_info,
                "match_details": {
                    "match_score": random.choice(["高", "中", "低"]),
                    "reason": f"【模拟】创作者 {creator_info.get('name', '未知创作者')} 在 {creator_info.get('category', '未知领域')} 领域与品牌 {brand_info.get('name', '未知品牌')} 有潜在契合点。",
                    "suggestions": f"【模拟】建议进行小规模试用合作，评估 {creator_info.get('name')} 的实际效果。"
                }
            })
        return {
            "success": True,
            "match_result": mock_results
        }