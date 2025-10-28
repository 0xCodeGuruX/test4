import React, { useState, useCallback, useEffect } from 'react';
import { HealthData, DietPlan } from '../types';
import { generateDietPlan } from '../services/geminiService';

interface PlanGeneratorProps {
    latestHealthData: HealthData | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-indigo-600"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-indigo-600" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-indigo-600" style={{ animationDelay: '0.4s' }}></div>
        <span className="text-gray-600 ml-2">正在生成您的个性化计划...</span>
    </div>
);

const DietCard: React.FC<{title: string; meal: {title: string; description: string} | undefined, icon: React.ReactNode}> = ({ title, meal, icon }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
            {icon}
            <h4 className="font-semibold text-gray-800 ml-2">{title}</h4>
        </div>
        <h5 className="font-medium text-indigo-700">{meal?.title || '...'}</h5>
        <p className="text-sm text-gray-600 mt-1">{meal?.description || '...'}</p>
    </div>
);

const PlanGenerator: React.FC<PlanGeneratorProps> = ({ latestHealthData }) => {
    const [preferences, setPreferences] = useState('');
    // Fix: Add state for API key management.
    const [apiKey, setApiKey] = useState('');
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fix: Load saved API key from localStorage on component mount.
    useEffect(() => {
        const savedKey = localStorage.getItem('deepseek_api_key');
        if (savedKey) {
            setApiKey(savedKey);
        }
    }, []);

    const handleSaveApiKey = () => {
        localStorage.setItem('deepseek_api_key', apiKey);
        alert('API 密钥已保存！');
    };

    const handleGeneratePlan = useCallback(async () => {
        if (!latestHealthData) {
            setError("没有可用的健康数据。请先输入您的数据。");
            return;
        }
        if (!apiKey) {
            setError('请输入您的 DeepSeek API 密钥。');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDietPlan(null);
        try {
            // Fix: Pass the apiKey from state to the service function.
            const plan = await generateDietPlan(latestHealthData, preferences, apiKey);
            setDietPlan(plan);
        } catch (err: any) {
            setError(err.message || '发生未知错误。');
        } finally {
            setIsLoading(false);
        }
    }, [latestHealthData, preferences, apiKey]);
    
    if (!latestHealthData) {
        return (
             <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700">未找到健康数据</h2>
                <p className="mt-2 text-gray-500">在生成计划之前，请前往“数据录入”页面添加您最新的健康指标。</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">AI 饮食计划生成器</h2>
                <p className="mt-1 text-sm text-gray-600">根据您最新的健康数据和饮食偏好，获取个性化的一日膳食计划。</p>
                
                <div className="mt-6 space-y-6">
                    {/* Fix: Add API Key input field and save button. */}
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">DeepSeek API 密钥</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                type="password"
                                id="apiKey"
                                className="flex-1 block w-full min-w-0 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="sk-..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSaveApiKey}
                                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">饮食偏好 (最重要)</label>
                        <textarea
                            id="preferences"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="例如：喜欢吃辣、素食、低碳水、想吃西瓜炒海参等..."
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading || !apiKey}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? '正在生成...' : '生成我的饮食计划'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">错误</p>
                    <p>{error}</p>
                </div>
            )}

            {isLoading && (
                 <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <LoadingSpinner />
                </div>
            )}
            
            {dietPlan && (
                <div className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-900">您的个性化饮食计划</h3>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DietCard title="早餐" meal={dietPlan.breakfast} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v2a5 5 0 0 0-5 5H3a7 7 0 0 1 7-7Z"/><path d="M14 3v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Z"/><path d="M21 15a9 9 0 0 1-9 6c-2.4 0-4.6-.9-6.2-2.3L2 15h19Z"/></svg>} />
                        <DietCard title="午餐" meal={dietPlan.lunch} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11h18"/><path d="M12 21a9 9 0 0 1 0-18v18Z"/><path d="M21 12a9 9 0 0 0-9-9h.01Z"/></svg>} />
                        <DietCard title="晚餐" meal={dietPlan.dinner} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-6"/><path d="M6 15h12"/><path d="M17.5 15a4.5 4.5 0 0 0-9 0"/><path d="m14 15-1-6-1 6h2Z"/><path d="M7 15a2.5 2.5 0 0 1 0-5c.8-1.5 2.2-2.5 4-2.5s3.2 1 4 2.5a2.5 2.5 0 0 1 0 5"/></svg>} />
                        <DietCard title="零食" meal={dietPlan.snacks} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4.4 4.4 0 0 0-4.2 3.1c-1.8.3-3.3 2-3.3 3.9 0 2.2 1.8 4 4 4h7c2.2 0 4-1.8 4-4 0-1.8-1.3-3.4-3-3.9A4.4 4.4 0 0 0 12 2Z"/><path d="M10.3 12.8a2.5 2.5 0 0 0 3.4 0l2-2.4a2.5 2.5 0 0 0-3.4-3.4l-2 2.4a2.5 2.5 0 0 0 0 3.4Z"/><path d="m8.3 15.8-.9 1.1a2.5 2.5 0 0 0 3.4 3.4l.9-1.1"/><path d="m15.7 15.8 1-1.1a2.5 2.5 0 0 1-3.4-3.4l-1 1.1"/></svg>} />
                    </div>

                    <div className="mt-6 bg-gray-50 border-l-4 border-gray-400 text-gray-800 p-4 rounded-r-lg">
                        <h4 className="font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-500"><path d="M15.09 16.05a2.1 2.1 0 0 1-2.6 2.35 2.23 2.23 0 0 1-1.6-2.1V14.5a2.23 2.23 0 0 1 1.6-2.1 2.1 2.1 0 0 1 2.6 2.35Z"/><path d="M8 12a4 4 0 0 1 8 0v2a4 4 0 1 1-8 0Z"/><path d="M12 22v-2"/><path d="M12 4V2"/><path d="m4.93 4.93.9.9"/><path d="M18.17 18.17l.9.9"/><path d="m2 12 .9.9"/><path d="M20.27 12l.9.9"/><path d="m4.93 19.07.9-.9"/><path d="M18.17 5.83l.9-.9"/></svg>
                            AI 思考过程
                        </h4>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{dietPlan.thinkingProcess}</p>
                    </div>

                    <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 p-4 rounded-r-lg">
                        <h4 className="font-semibold">来自您的 AI 营养师的建议</h4>
                        <p className="text-sm mt-1">{dietPlan.notes}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanGenerator;