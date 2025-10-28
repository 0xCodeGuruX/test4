import { User, HealthData } from '../types';

const USERS_KEY = 'healthwise_users';
const CURRENT_USER_KEY = 'healthwise_currentUser';
const HEALTH_HISTORY_PREFIX = 'healthwise_healthHistory_';

// Mock password hashing for this simulation
const hashPassword = (password: string) => `hashed_${password}`;

export const registerUser = (newUser: User): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[newUser.username]) {
        throw new Error('用户名已存在。');
    }
    if (!newUser.password) {
        throw new Error('密码不能为空。');
    }
    users[newUser.username] = { ...newUser, password: hashPassword(newUser.password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password, ...userToStore } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
    return userToStore;
};

export const loginUser = (username: string, pass: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const user = users[username];
    if (user && user.password === hashPassword(pass)) {
        const { password, ...userToReturn } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
        return userToReturn;
    }
    throw new Error('用户名或密码无效。');
};

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

export const updateUser = (updatedUser: User): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const currentUser = getCurrentUser();
    if (!currentUser || !users[currentUser.username]) {
        throw new Error('未找到用户。');
    }
    
    const storedUser = users[currentUser.username];
    // Keep the original password
    const newUserData = { ...storedUser, ...updatedUser };
    users[currentUser.username] = newUserData;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password, ...userToStore } = newUserData;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
    return userToStore;
};


export const getHealthHistory = (username: string): HealthData[] => {
    const historyJson = localStorage.getItem(`${HEALTH_HISTORY_PREFIX}${username}`);
     if (historyJson) {
        return JSON.parse(historyJson);
    }
    // For new users, return an empty array instead of mock data.
    return [];
};

export const saveHealthHistory = (username: string, history: HealthData[]) => {
    localStorage.setItem(`${HEALTH_HISTORY_PREFIX}${username}`, JSON.stringify(history));
};