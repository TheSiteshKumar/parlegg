export interface WalletBalance {
  investment: number;
  earnings: number;
  totalAdded: number;
  totalUsed: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'earning';
  amount: number;
  timestamp: string;
  description: string;
}

export interface Withdrawal {
  id?: string;
  userId: string;
  amount: number;
  approved: boolean;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  transactionId?: string;
  paymentMethod?: string;
  upiId?: string;
}

export interface AddFundRequest {
  id?: string;
  userId: string;
  amount: number;
  utrNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: string;
}