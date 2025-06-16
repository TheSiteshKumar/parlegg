import { InvestmentPlan } from '../types/investment';

export const investmentPlans: InvestmentPlan[] = [
  {
    level: "600",
    amount: 600,
    dailyReturns: 27,
    duration: 45,
    totalReturn: 1215,
    image: "https://images.unsplash.com/photo-1638913662180-afc4334cf422?auto=format&fit=crop&q=80&w=400",
    name: "Starter Plan",
    description: "Perfect for beginners starting their investment journey",
    purchaseLimit: 1
  },
  {
    level: "3800",
    amount: 3800,
    dailyReturns: 174,
    duration: 45,
    totalReturn: 7830,
    image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=400",
    name: "Growth Plan",
    description: "Ideal for those looking to grow their investments",
    purchaseLimit: 3
  },
  {
    level: "9600",
    amount: 9600,
    dailyReturns: 450,
    duration: 45,
    totalReturn: 20250,
    image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?auto=format&fit=crop&q=80&w=400",
    name: "Advanced Plan",
    description: "For experienced investors seeking higher returns",
    purchaseLimit: 3
  },
  {
    level: "20800",
    amount: 20800,
    dailyReturns: 987,
    duration: 45,
    totalReturn: 44415,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400",
    name: "Premium Plan",
    description: "Unlimited investment opportunities for maximum returns",
    purchaseLimit: 0 // 0 means no limit
  }
];