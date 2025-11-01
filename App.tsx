import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { HealthData, Page, User } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataInputForm from './components/DataInputForm';
import PlanGenerator from './components/PlanGenerator';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import * as userService from './services/userService';

// 这是应用的主组件
const App: React.FC = () => {
    // 存储当前登录的用户信息
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // 控制显示登录页还是注册页
    const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
    // 控制当前显示的主页面
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    // 存储用户的健康数据历史记录
    const [healthHistory, setHealthHistory] = useState<HealthData[]>([]);

    // 组件挂载时检查是否有已登录的用户
    useEffect(() => {
        const user = userService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setHealthHistory(userService.getHealthHistory(user.username));
        }
    }, []);

    // 处理用户登录
    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setHealthHistory(userService.getHealthHistory(user.username));
        setCurrentPage('dashboard');
    };

    // 处理用户登出
    const handleLogout = () => {
        userService.logoutUser();
        setCurrentUser(null);
        setHealthHistory([]);
        setAuthPage('login');
    };

    // 处理用户注册
    const handleRegister = (user: User) => {
        setCurrentUser(user);
        setHealthHistory(userService.getHealthHistory(user.username));
        setCurrentPage('dashboard');
    };
    
    // 处理个人信息更新
    const handleUpdateProfile = (updatedUser: User) => {
        const user = userService.updateUser(updatedUser);
        if(user) {
            setCurrentUser(user);
            alert('个人信息更新成功！');
            setCurrentPage('dashboard');
        }
    };

    // 添加或更新健康数据
    const handleAddHealthData = useCallback((newData: HealthData) => {
        if (!currentUser) return;
        
        const newHistory = [...healthHistory];
        // 检查当天是否已有数据
        const existingIndex = newHistory.findIndex(d => d.date === newData.date);
        
        if (existingIndex > -1) {
            // 如果有，则更新数据
            newHistory[existingIndex] = newData;
        } else {
            // 如果没有，则添加新数据
            newHistory.push(newData);
        }

        // 按日期排序，确保图表显示正确
        newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setHealthHistory(newHistory);
        userService.saveHealthHistory(currentUser.username, newHistory);
        setCurrentPage('dashboard');
    }, [currentUser, healthHistory]);
    
    // 使用 useMemo 缓存最新的健康数据，避免不必要的重计算
    const latestHealthData = useMemo(() => healthHistory.length > 0 ? healthHistory[healthHistory.length - 1] : null, [healthHistory]);

    // 根据当前页面状态渲染对应组件
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard healthHistory={healthHistory} />;
            case 'dataInput':
                return <DataInputForm onAddData={handleAddHealthData} latestData={latestHealthData} />;
            case 'planGenerator':
                return <PlanGenerator latestHealthData={latestHealthData} />;
            case 'profile':
                return <Profile user={currentUser!} onUpdateProfile={handleUpdateProfile} />;
            default:
                return <Dashboard healthHistory={healthHistory} />;
        }
    };

    // 如果没有用户登录，显示认证页面
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                {authPage === 'login' ? (
                    <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthPage('register')} />
                ) : (
                    <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthPage('login')} />
                )}
            </div>
        );
    }

    // 用户登录后，显示主应用界面
    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage}
                user={currentUser}
                onLogout={handleLogout}
            />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
