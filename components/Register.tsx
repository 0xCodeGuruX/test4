import React, { useState } from 'react';
import { User } from '../types';
import * as userService from '../services/userService';

interface RegisterProps {
    onRegister: (user: User) => void;
    onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
    const [formData, setFormData] = useState<User>({
        username: '',
        password: '',
        name: '',
        age: '',
        gender: '',
        email: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password && formData.password.length < 6) {
            setError('密码长度不能少于6位。');
            return;
        }
        try {
            const user = userService.registerUser(formData);
            if (user) {
                onRegister(user);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <div>
                <h2 className="text-3xl font-bold text-center text-gray-900">创建新账户</h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    已有账户?{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                        请登录
                    </button>
                </p>
            </div>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                 <input name="username" type="text" required value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="用户名" />
                 <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="密码 (最少6位)" />
                 <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="姓名" />
                 <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="年龄" />
                 <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="" disabled>选择性别</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                 </select>
                 <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="邮箱" />
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                
                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        注册
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
