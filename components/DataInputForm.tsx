import React, { useState } from 'react';
import { HealthData } from '../types';

interface DataInputFormProps {
    onAddData: (data: Omit<HealthData, 'date'>) => void;
    latestData: HealthData | null;
}

const DataInputForm: React.FC<DataInputFormProps> = ({ onAddData, latestData }) => {
    const [heartRate, setHeartRate] = useState(latestData?.heartRate || 70);
    const [spo2, setSpo2] = useState(latestData?.spo2 || 98);
    const [stress, setStress] = useState(latestData?.stress || 30);
    const [sleepHours, setSleepHours] = useState(latestData?.sleepHours || 7.5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddData({ 
            heartRate: Number(heartRate), 
            spo2: Number(spo2), 
            stress: Number(stress), 
            sleepHours: Number(sleepHours) 
        });
    };
    
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">输入今日健康指标</h2>
            <p className="mt-1 text-sm text-gray-600">更新您的生理数据。此功能模拟从智能手环获取数据。</p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <InputSlider label="静息心率" value={heartRate} onChange={e => setHeartRate(Number(e.target.value))} min={40} max={120} step={1} unit="bpm" />
                <InputSlider label="血氧饱和度 (SpO2)" value={spo2} onChange={e => setSpo2(Number(e.target.value))} min={90} max={100} step={1} unit="%" />
                <InputSlider label="压力水平" value={stress} onChange={e => setStress(Number(e.target.value))} min={1} max={100} step={1} unit="" />
                <InputSlider label="睡眠时长" value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} min={0} max={12} step={0.1} unit="小时" />
                
                <div className="pt-5">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        保存今日数据
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DataInputForm;
