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

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [healthHistory, setHealthHistory] = useState<HealthData[]>([]);

    useEffect(() => {
        const user = userService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setHealthHistory(userService.getHealthHistory(user.username));
        }
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setHealthHistory(userService.getHealthHistory(user.username));
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        userService.logoutUser();
        setCurrentUser(null);
        setHealthHistory([]);
        setAuthPage('login');
    };

    const handleRegister = (user: User) => {
        setCurrentUser(user);
        setHealthHistory(userService.getHealthHistory(user.username));
        setCurrentPage('dashboard');
    };
    
    const handleUpdateProfile = (updatedUser: User) => {
        const user = userService.updateUser(updatedUser);
        if(user) {
            setCurrentUser(user);
            alert('个人信息更新成功！');
            setCurrentPage('dashboard');
        }
    };

    const handleAddHealthData = useCallback((newData: Omit<HealthData, 'date'>) => {
        if (!currentUser) return;
        
        const today = new Date().toISOString().split('T')[0];
        const newHistory = [...healthHistory];
        const existingIndex = newHistory.findIndex(d => d.date === today);
        const entry = { ...newData, date: today };
        
        if (existingIndex > -1) {
            newHistory[existingIndex] = entry;
        } else {
            newHistory.push(entry);
        }

        // Sort by date to ensure chronological order
        newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setHealthHistory(newHistory);
        userService.saveHealthHistory(currentUser.username, newHistory);
        setCurrentPage('dashboard');
    }, [currentUser, healthHistory]);
    
    const latestHealthData = useMemo(() => healthHistory.length > 0 ? healthHistory[healthHistory.length - 1] : null, [healthHistory]);

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
