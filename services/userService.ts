import { User, HealthData } from '../types';

// 定义存储在 localStorage 中的键名
const USERS_KEY = 'healthwise_users';
const CURRENT_USER_KEY = 'healthwise_currentUser';
const HEALTH_HISTORY_PREFIX = 'healthwise_healthHistory_';

// 模拟密码哈希，用于演示目的
const hashPassword = (password: string) => `hashed_${password}`;

// 注册新用户
export const registerUser = (newUser: User): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[newUser.username]) {
        throw new Error('用户名已存在。');
    }
    if (!newUser.password) {
        throw new Error('密码不能为空。');
    }
    // 存储用户信息，并“哈希”密码
    users[newUser.username] = { ...newUser, password: hashPassword(newUser.password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // 从返回给应用的对象中移除密码
    const { password, ...userToStore } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
    return userToStore;
};

// 登录用户
export const loginUser = (username: string, pass: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const user = users[username];
    // 验证用户名和密码
    if (user && user.password === hashPassword(pass)) {
        const { password, ...userToReturn } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
        return userToReturn;
    }
    throw new Error('用户名或密码无效。');
};

// 登出用户
export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// 获取当前登录的用户
export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

// 更新用户信息
export const updateUser = (updatedUser: User): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const currentUser = getCurrentUser();
    if (!currentUser || !users[currentUser.username]) {
        throw new Error('未找到用户。');
    }
    
    const storedUser = users[currentUser.username];
    // 合并旧数据和新数据，并保留原始密码
    const newUserData = { ...storedUser, ...updatedUser };
    users[currentUser.username] = newUserData;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // 从返回的对象中移除密码
    const { password, ...userToStore } = newUserData;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
    return userToStore;
};

// 获取指定用户的健康历史记录
export const getHealthHistory = (username: string): HealthData[] => {
    const historyJson = localStorage.getItem(`${HEALTH_HISTORY_PREFIX}${username}`);
     if (historyJson) {
        return JSON.parse(historyJson);
    }
    // 对新用户返回一个空数组
    return [];
};

// 保存指定用户的健康历史记录
export const saveHealthHistory = (username: string, history: HealthData[]) => {
    localStorage.setItem(`${HEALTH_HISTORY_PREFIX}${username}`, JSON.stringify(history));
};
