export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string | null;
  amount: number;
  currency: string;
  bankDetails: BankDetails | null;
  status: PayoutStatus;
  requestedAt: any;
  processedAt: any | null;
  adminNotes: string | null;
  transactionId: string | null;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string | null;
  upiId: string | null;
  accountType: string;
}

export interface FemalePaymentAccount {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string | null;
  bankBranchName: string | null;
  upiId: string | null;
  accountType: string;
  razorpayContactId: string | null;
  razorpayFundAccountId: string | null;
  status: 'pending' | 'verified' | 'failed';
  createdAt: any;
  updatedAt: any;
}

export interface PayoutStats {
  totalPayouts: number;
  totalAmountPaid: number;
  pendingCount: number;
  pendingAmount: number;
  processingCount: number;
  processingAmount: number;
  completedCount: number;
  completedAmount: number;
  rejectedCount: number;
  rejectedAmount: number;
}
