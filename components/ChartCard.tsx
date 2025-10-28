import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HealthData } from '../types';

interface ChartCardProps {
    title: string;
    data: HealthData[];
    dataKey: keyof Omit<HealthData, 'date'>;
    color: string;
    unit: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, dataKey, color, unit }) => {
    
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
                    <p className="label font-semibold text-gray-700">{`日期: ${label}`}</p>
                    <p className="intro" style={{ color }}>{`${payload[0].name}: ${payload[0].value}${unit}`}</p>
                </div>
            );
        }
        return null;
    };
    
    // Formatting date for X-axis
    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tickFormatter={formatXAxis} stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} unit={unit} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 4, fill: color, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                            name={title.replace('趋势', '').replace(' (SpO2)', '')}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;
