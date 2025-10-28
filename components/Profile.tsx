import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
    user: User;
    onUpdateProfile: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile }) => {
    const [formData, setFormData] = useState<User>(user);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' ? (value ? parseInt(value, 10) : '') : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">个人中心</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        编辑
                    </button>
                )}
            </div>
            <p className="mt-1 text-sm text-gray-600">查看并更新您的个人信息。</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">用户名</label>
                    <input type="text" value={formData.username} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">姓名</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${!isEditing && 'bg-gray-100'}`} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">邮箱</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${!isEditing && 'bg-gray-100'}`} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">年龄</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} disabled={!isEditing} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${!isEditing && 'bg-gray-100'}`} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">性别</label>
                     <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}>
                        <option value="male">男</option>
                        <option value="female">女</option>
                        <option value="other">其他</option>
                    </select>
                </div>
                
                {isEditing && (
                    <div className="flex items-center justify-end space-x-4 pt-5">
                         <button
                            type="button"
                            onClick={() => { setIsEditing(false); setFormData(user); }}
                            className="w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            保存更改
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
