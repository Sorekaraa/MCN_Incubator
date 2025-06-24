import React, { useState } from 'react';
import { Card, Select, Input, Button, message, Form, Spin, Collapse } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

function ContentGenerator() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const handleGenerateContent = async (values) => {
        setLoading(true);
        setGeneratedContent(null); // 清空之前生成的内容

        const { contentType, platform, topic } = values;

        if (!topic) {
            messageApi.error('请输入主题！');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/generate', { // 后端地址
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    contentType: contentType === 'title' ? 'title' : 'post', // 后端只区分 title 和 post
                    platform, // 可以发送，后端目前未使用
                }),
            });

            const data = await response.json();

            if (data.success) {
                setGeneratedContent(data.content);
                messageApi.success('内容生成成功！');
            } else {
                messageApi.error(`内容生成失败: ${data.message || '未知错误'}`);
            }
        } catch (error) {
            console.error('内容生成请求失败:', error);
            messageApi.error(`内容生成请求失败，请检查网络连接或后端服务: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="AI 内容生成" style={{ marginBottom: 24 }}>
            {contextHolder}
            <p>使用AI技术生成高质量的内容标题、脚本等</p>
            <Form
                form={form}
                layout="horizontal"
                onFinish={handleGenerateContent}
                initialValues={{
                    contentType: 'post', // 默认内容类型
                    platform: 'douyin', // 默认平台
                    topic: '',
                }}
            >
                <Form.Item label="内容类型" name="contentType" style={{ width: '200px', display: 'inline-block', marginRight: '20px' }}>
                    <Select>
                        <Option value="post">短视频脚本</Option>
                        <Option value="title">标题</Option>
                        {/* 可以添加更多内容类型 */}
                    </Select>
                </Form.Item>
                <Form.Item label="平台" name="platform" style={{ width: '200px', display: 'inline-block', marginRight: '20px' }}>
                    <Select>
                        <Option value="douyin">抖音</Option>
                        <Option value="kuaishou">快手</Option>
                        <Option value="xiaohongshu">小红书</Option>
                        {/* 可以添加更多平台 */}
                    </Select>
                </Form.Item>
                <Form.Item label="主题" name="topic" style={{ width: '300px', display: 'inline-block' }}>
                    <Input placeholder="请输入内容主题，如：夏日旅行攻略" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} icon={loading ? <LoadingOutlined /> : null}>
                        生成内容
                    </Button>
                </Form.Item>
            </Form>

            {loading && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    <p>AI 正在生成内容中...</p>
                </div>
            )}

            {generatedContent && (
                <Card title="生成结果" style={{ marginTop: 20 }}>
                    <Collapse defaultActiveKey={['1', '2', '3', '4']} bordered={false}>
                        <Panel header="标题" key="1">
                            <p style={{ whiteSpace: 'pre-wrap' }}>{generatedContent.title}</p>
                        </Panel>
                        {form.getFieldValue('contentType') !== 'title' && ( // 只有非标题类型才显示描述和脚本
                            <>
                                <Panel header="描述" key="2">
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{generatedContent.description}</p>
                                </Panel>
                                <Panel header="脚本" key="3">
                                    <TextArea
                                        value={generatedContent.script}
                                        autoSize={{ minRows: 5, maxRows: 15 }}
                                        readOnly
                                        bordered={false}
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    />
                                </Panel>
                            </>
                        )}
                        <Panel header="标签" key="4">
                            <p>{generatedContent.tags && generatedContent.tags.join(', ')}</p>
                        </Panel>
                    </Collapse>
                </Card>
            )}
        </Card>
    );
}

export default ContentGenerator;