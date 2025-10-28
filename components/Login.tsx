import React, { useState } from 'react';
import * as userService from '../services/userService';
import { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const user = userService.loginUser(username, password);
            if (user) {
                onLogin(user);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
            <div>
                <h2 className="text-3xl font-bold text-center text-gray-900">登录您的账户</h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    或{' '}
                    <button onClick={onSwitchToRegister} className="font-medium text-indigo-600 hover:text-indigo-500">
                        注册一个新账户
                    </button>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="username" className="sr-only">用户名</label>
                        <input id="username" name="username" type="text" required value={username} onChange={e => setUsername(e.target.value)} className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="用户名" />
                    </div>
                    <div>
                        <label htmlFor="password-login" className="sr-only">密码</label>
                        <input id="password-login" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="密码" />
                    </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        登录
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
