import React, { useMemo } from 'react';
import { HealthData } from '../types';
import ChartCard from './ChartCard';

interface DashboardProps {
    healthHistory: HealthData[];
}

// 统计卡片组件，用于显示单项指标
const StatCard: React.FC<{ title: string; value: string | number; unit: string; icon: React.ReactNode; color: string }> = ({ title, value, unit, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value} <span className="text-base font-normal text-gray-600">{unit}</span></p>
        </div>
    </div>
);

// 定义各种指标的图标
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const LungsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-2 0-3.8-1-5-2.5S4 16.2 4 14.5c0-3.5 2.5-6.5 5-7.5C10 6 11 5 12 5s2 1 3 2c2.5 1 5 4 5 7.5c0 1.7-1 3.3-2.5 4.5S14 22 12 22Z"></path><path d="M12 5c2.5 0 4.5 2 4.5 4.5v0c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5v0C7.5 7 9.5 5 12 5Z"></path><path d="M12 14c-1.5 0-2.8.9-3.5 2.2"></path><path d="M15.5 16.2c-.7-1.3-2-2.2-3.5-2.2"></path></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.993.142"></path><path d="M12 5a3 3 0 1 1 5.993.142"></path><path d="M15 13a3 3 0 1 0-5.993.142"></path><path d="M15 13a3 3 0 1 1 5.993.142"></path><path d="M9 13a3 3 0 1 1 5.993.142"></path><path d="M9 13a3 3 0 1 0-5.993.142"></path><path d="M12 19a3 3 0 1 1 5.993.142"></path><path d="M12 19a3 3 0 1 0-5.993.142"></path><path d="M12 5a3 3 0 0 1-2.996 3.142"></path><path d="M12 5a3 3 0 0 0 2.996 3.142"></path><path d="M12 11a3 3 0 0 0-2.996-3.142"></path><path d="M12 11a3 3 0 0 1 2.996-3.142"></path><path d="M15 13a3 3 0 0 1-2.996 3.142"></path><path d="M15 13a3 3 0 0 0 2.996 3.142"></path><path d="M9 13a3 3 0 0 0-2.996-3.142"></path><path d="M9 13a3 3 0 0 1 2.996-3.142"></path><path d="M12 19a3 3 0 0 0-2.996-3.142"></path><path d="M12 19a3 3 0 0 1 2.996-3.142"></path></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"></path><path d="M2 10h20"></path><path d="M12 4v6"></path><path d="M12 14v6"></path><path d="M20 18v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path><path d="M18 10V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"></path></svg>;

// 仪表盘主组件
const Dashboard: React.FC<DashboardProps> = ({ healthHistory }) => {
    // 从健康历史记录中提取最新的数据点
    const latestData = useMemo(() => healthHistory.length > 0 ? healthHistory[healthHistory.length - 1] : null, [healthHistory]);
    
    // 如果没有健康数据，显示提示信息
    if (healthHistory.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-700">无健康数据</h2>
                <p className="mt-2 text-gray-500">请先添加您的生理数据以查看仪表盘。</p>
            </div>
        );
    }

    // 渲染仪表盘界面
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">健康仪表盘</h2>
                <p className="mt-1 text-sm text-gray-600">您的最新健康指标概览。</p>
            </div>
            
            {/* 显示最新的统计数据卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="心率" value={latestData?.heartRate || 'N/A'} unit="bpm" icon={<HeartIcon />} color="bg-red-100 text-red-600"/>
                <StatCard title="血氧饱和度" value={latestData?.spo2 || 'N/A'} unit="%" icon={<LungsIcon />} color="bg-blue-100 text-blue-600"/>
                <StatCard title="压力水平" value={latestData?.stress || 'N/A'} unit="/100" icon={<BrainIcon />} color="bg-yellow-100 text-yellow-600"/>
                <StatCard title="睡眠" value={latestData?.sleepHours || 'N/A'} unit="小时" icon={<BedIcon />} color="bg-purple-100 text-purple-600"/>
            </div>

            {/* 显示各项指标的历史趋势图 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="心率趋势" data={healthHistory} dataKey="heartRate" color="#ef4444" unit=" bpm" />
                <ChartCard title="血氧饱和度 (SpO2) 趋势" data={healthHistory} dataKey="spo2" color="#3b82f6" unit="%" />
                <ChartCard title="压力水平趋势" data={healthHistory} dataKey="stress" color="#eab308" unit="" />
                <ChartCard title="睡眠时长趋势" data={healthHistory} dataKey="sleepHours" color="#8b5cf6" unit=" 小时" />
            </div>
        </div>
    );
};

export default Dashboard;
