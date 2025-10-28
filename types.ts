// Fix: Define and export HealthData interface. Remove circular import.
export interface HealthData {
    date: string;
    heartRate: number;
    spo2: number;
    stress: number;
    sleepHours: number;
}

export interface DietPlan {
  breakfast: { title: string; description: string; };
  lunch: { title: string; description: string; };
  dinner: { title: string; description: string; };
  snacks: { title: string; description: string; };
  notes: string;
  thinkingProcess: string;
}

export interface User {
    username: string;
    password?: string;
    name: string;
    age: number | '';
    gender: 'male' | 'female' | 'other' | '';
    email: string;
}

export type Page = 'dashboard' | 'dataInput' | 'planGenerator' | 'profile';