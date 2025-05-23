export type CommissionStatus = 
  | 'Pending'
  | 'Partial'
  | 'Paid'
  | 'Overdue'
  | 'Disputed';

export type CommissionType = 
  | 'Standard'
  | 'Referral'
  | 'Pre-Construction'
  | 'Commercial'
  | 'Rental';

export interface CommissionPayment {
  id: string;
  amount: number;
  paymentDate: string;
  method: 'Direct Deposit' | 'Check' | 'Wire Transfer' | 'Other';
  notes?: string;
  receiptUrl?: string;
}

export interface CommissionSplit {
  agentId: string;
  percentage: number;
  amount: number;
  isPaid: boolean;
  paymentId?: string;
}

export interface CommissionReminder {
  id: string;
  dueDate: string;
  isTriggered: boolean;
  notificationType: 'Email' | 'SMS' | 'App' | 'All';
  reminderDays: number; // days before due date
}

export interface Commission {
  id: string;
  listingId: string;
  type: CommissionType;
  status: CommissionStatus;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  dueDate: string;
  brokeragePercentage: number;
  brokerageAmount: number;
  agentPercentage: number;
  agentAmount: number;
  payments: CommissionPayment[];
  splits?: CommissionSplit[];
  reminders: CommissionReminder[];
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface CommissionSchedule {
  id: string;
  listingId: string;
  totalAmount: number;
  milestones: PaymentMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  paymentId?: string;
  notes?: string;
  reminderSent: boolean;
} 