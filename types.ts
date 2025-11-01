// 定义单日的健康数据结构
export interface HealthData {
    // 日期字符串，格式为 YYYY-MM-DD
    date: string;
    // 静息心率
    heartRate: number;
    // 血氧饱和度
    spo2: number;
    // 压力水平
    stress: number;
    // 睡眠小时数
    sleepHours: number;
}

// 定义 AI 生成的饮食计划结构
export interface DietPlan {
  // 早餐建议
  breakfast: { title: string; description: string; };
  // 午餐建议
  lunch: { title: string; description: string; };
  // 晚餐建议
  dinner: { title: string; description: string; };
  // 零食建议
  snacks: { title: string; description: string; };
  // 总体备注
  notes: string;
  // AI 的思考过程
  thinkingProcess: string;
}

// 定义用户数据结构
export interface User {
    // 唯一的用户名
    username: string;
    // 密码 (可选，仅在注册时使用)
    password?: string;
    // 用户的真实姓名
    name: string;
    // 年龄
    age: number | '';
    // 性别
    gender: 'male' | 'female' | 'other' | '';
    // 邮箱地址
    email: string;
}

// 定义应用中所有可能的页面类型
export type Page = 'dashboard' | 'dataInput' | 'planGenerator' | 'profile';
