import React, { useState, useEffect } from 'react';
import { HealthData } from '../types';

interface DataInputFormProps {
    onAddData: (data: HealthData) => void;
    latestData: HealthData | null;
}

// 数据录入表单组件
const DataInputForm: React.FC<DataInputFormProps> = ({ onAddData, latestData }) => {
    // 状态：记录用户选择的日期
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    // 状态：记录心率
    const [heartRate, setHeartRate] = useState(70);
    // 状态：记录血氧饱和度
    const [spo2, setSpo2] = useState(98);
    // 状态：记录压力水平
    const [stress, setStress] = useState(30);
    // 状态：记录睡眠时长
    const [sleepHours, setSleepHours] = useState(7.5);
    
    // 副作用钩子，当`latestData`更新时，用最新数据填充表单
    useEffect(() => {
        if (latestData) {
            setHeartRate(latestData.heartRate);
            setSpo2(latestData.spo2);
            setStress(latestData.stress);
            setSleepHours(latestData.sleepHours);
        }
    }, [latestData]);

    // 处理表单提交
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddData({ 
            date,
            heartRate: Number(heartRate), 
            spo2: Number(spo2), 
            stress: Number(stress), 
            sleepHours: Number(sleepHours) 
        });
    };
    
    // 可重用组件：带滑块的输入框
    const InputSlider: React.FC<{label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min: number; max: number; step: number; unit: string}> = ({ label, value, onChange, min, max, step, unit }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center space-x-4 mt-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={onChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-semibold text-indigo-600 w-24 text-right">{value} {unit}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">同步手环数据</h2>
            <p className="mt-1 text-sm text-gray-600">此功能模拟从您的智能手环同步健康数据。选择日期并更新您的指标。</p>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <span>数据来源：已链接的小米手环 8 Pro (模拟)</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <div>
                    <label htmlFor="health-date" className="block text-sm font-medium text-gray-700">选择数据日期</label>
                    <input
                        type="date"
                        id="health-date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <InputSlider label="静息心率" value={heartRate} onChange={e => setHeartRate(Number(e.target.value))} min={40} max={120} step={1} unit="bpm" />
                <InputSlider label="血氧饱和度 (SpO2)" value={spo2} onChange={e => setSpo2(Number(e.target.value))} min={90} max={100} step={1} unit="%" />
                <InputSlider label="压力水平" value={stress} onChange={e => setStress(Number(e.target.value))} min={1} max={100} step={1} unit="" />
                <InputSlider label="睡眠时长" value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} min={0} max={12} step={0.1} unit="小时" />
                
                <div className="pt-5">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        保存数据
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DataInputForm;
