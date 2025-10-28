// Fix: Revert to DeepSeek API and accept apiKey as a parameter.
import { HealthData, DietPlan } from '../types';

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export const generateDietPlan = async (
    healthData: HealthData, 
    preferences: string,
    apiKey: string, // apiKey is now a required parameter
): Promise<DietPlan> => {
    if (!apiKey) {
        throw new Error('DeepSeek API 密钥缺失。请在输入框中提供您的密钥。');
    }

    const { heartRate, spo2, stress, sleepHours } = healthData;

    // A system prompt to instruct the AI on its role and the desired output format.
    const systemInstruction = `
        You are an expert nutritionist and a creative chef. Your primary goal is to create a healthy one-day diet plan that is **heavily based on the user's stated preferences**. The user's preferences are the most important factor to consider.

        You must also provide a step-by-step "thinking process" explaining how you designed the plan. This should detail how you incorporated the health data and, most importantly, the user's preferences into your meal choices.

        You MUST respond with a JSON object that strictly follows this structure: {"breakfast": {"title": "string", "description": "string"}, "lunch": {"title": "string", "description": "string"}, "dinner": {"title": "string", "description": "string"}, "snacks": {"title": "string", "description": "string"}, "notes": "string", "thinkingProcess": "string"}.
        The language of the entire response must be Simplified Chinese.
    `;
    
    // The user's specific data and request.
    const userPrompt = `
        请根据以下健康数据和用户偏好，为用户创建一份健康的一日饮食计划。

        健康数据:
        - 静息心率: ${heartRate} bpm
        - 血氧饱和度 (SpO2): ${spo2}%
        - 压力水平: ${stress}/100
        - 睡眠时长: ${sleepHours} 小时

        用户饮食偏好 (最重要):
        - ${preferences || '无特殊偏好。请注重健康均衡。'}

        请为早餐、午餐、晚餐和零食提供均衡的计划。同时，请附上一段简短的总体建议和一个思考过程。
    `;

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { "role": "system", "content": systemInstruction },
                    { "role": "user", "content": userPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API 请求失败: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content) as DietPlan;

    } catch (error) {
        console.error("生成饮食计划时出错:", error);
        throw new Error("无法生成饮食计划。请检查您的网络连接或 API 密钥是否正确。");
    }
};