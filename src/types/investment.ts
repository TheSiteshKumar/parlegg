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