import React from 'react';
import { Page, User } from '../types';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    user: User;
    onLogout: () => void;
}

const HeartbeatIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const NavItem: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <HeartbeatIcon className="h-8 w-8 text-indigo-600" />
                        <h1 className="ml-3 text-2xl font-bold text-gray-900 tracking-tight">
                            健康管理系统
                        </h1>
                    </div>
                     <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm text-gray-600">欢迎, {user.name || user.username}</span>
                        <NavItem page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage}>仪表盘</NavItem>
                        <NavItem page="dataInput" currentPage={currentPage} setCurrentPage={setCurrentPage}>数据录入</NavItem>
                        <NavItem page="planGenerator" currentPage={currentPage} setCurrentPage={setCurrentPage}>生成计划</NavItem>
                        <NavItem page="profile" currentPage={currentPage} setCurrentPage={setCurrentPage}>个人中心</NavItem>
                        <button onClick={onLogout} className="px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">退出登录</button>
                    </div>
                </div>
            </div>
            {/* Mobile Navigation */}
            <nav className="md:hidden flex items-center justify-around p-2 border-t border-gray-200">
                <NavItem page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage}>仪表盘</NavItem>
                <NavItem page="dataInput" currentPage={currentPage} setCurrentPage={setCurrentPage}>数据录入</NavItem>
                <NavItem page="planGenerator" currentPage={currentPage} setCurrentPage={setCurrentPage}>生成计划</NavItem>
                <NavItem page="profile" currentPage={currentPage} setCurrentPage={setCurrentPage}>个人中心</NavItem>
            </nav>
        </header>
    );
};

export default Header;
