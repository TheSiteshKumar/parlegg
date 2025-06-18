export interface InvestmentPlan {
  level: string;
  amount: number;
  dailyReturns: number;
  duration: number;
  totalReturn: number;
  image: string;
  name: string;
  description: string;
  purchaseLimit: number; // Adding purchase limit
}

export interface Investment {
  id?: string;
  planLevel: string;
  investmentDate: string;
  endDate: string;
  amount: number;
  dailyReturns: number;
  totalReturn: number;
  daysRemaining: number;
  duration: number;
  image: string;
  name: string;
  userId?: string;
  status?: 'active' | 'completed';
  createdAt?: string;
}

export interface PlanPurchaseHistory {
  id?: string;
  userId: string;
  planLevel: string;
  planName: string;
  purchaseCount: number;
  lastPurchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseLimitError extends Error {
  code: 'PURCHASE_LIMIT_EXCEEDED';
  planName: string;
  currentCount: number;
  maxLimit: number;
}