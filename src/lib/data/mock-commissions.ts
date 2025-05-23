import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { 
  Commission, 
  CommissionType, 
  CommissionStatus, 
  CommissionPayment,
  CommissionSplit,
  CommissionReminder,
  CommissionSchedule,
  PaymentMilestone
} from '@/types/commission';
import { mockListings } from './mock-listings';
import { mockUsers } from './mock-users';

// Generate consistent data for demo
faker.seed(159);

// Helper function to generate commission payments
function generateCommissionPayments(count: number, totalAmount: number): CommissionPayment[] {
  const payments: CommissionPayment[] = [];
  let remainingAmount = totalAmount;
  const paymentMethods = ['Direct Deposit', 'Check', 'Wire Transfer', 'Other'] as const;
  
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const amount = isLast ? remainingAmount : Math.round(totalAmount / count);
    remainingAmount -= amount;
    
    payments.push({
      id: uuidv4(),
      amount,
      paymentDate: faker.date.recent().toISOString(),
      method: faker.helpers.arrayElement(paymentMethods),
      notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
      receiptUrl: faker.datatype.boolean(0.7) ? `/mock-documents/receipt-${faker.string.alphanumeric(8)}.pdf` : undefined
    });
  }
  
  return payments;
}

// Helper function to generate commission splits
function generateCommissionSplits(totalAmount: number): CommissionSplit[] {
  const splits: CommissionSplit[] = [];
  const agentCount = faker.number.int({ min: 1, max: 3 });
  let remainingPercentage = 100;
  
  const agents = faker.helpers.arrayElements(
    mockUsers.filter(user => user.role === 'Agent' || user.role === 'TeamLead'),
    agentCount
  );
  
  agents.forEach((agent, index) => {
    const isLast = index === agents.length - 1;
    const percentage = isLast ? remainingPercentage : faker.number.int({ min: 10, max: 60 });
    remainingPercentage -= percentage;
    
    const amount = Math.round((totalAmount * percentage) / 100);
    const isPaid = faker.datatype.boolean(0.6);
    
    splits.push({
      agentId: agent.id,
      percentage,
      amount,
      isPaid,
      paymentId: isPaid ? uuidv4() : undefined
    });
  });
  
  return splits;
}

// Helper function to generate commission reminders
function generateCommissionReminders(dueDate: string): CommissionReminder[] {
  const reminders: CommissionReminder[] = [];
  const reminderDayOptions = [1, 3, 7, 14, 30];
  const reminderCount = faker.number.int({ min: 1, max: 3 });
  
  const selectedDays = faker.helpers.arrayElements(reminderDayOptions, reminderCount);
  
  selectedDays.forEach(days => {
    reminders.push({
      id: uuidv4(),
      dueDate,
      isTriggered: faker.datatype.boolean(0.3),
      notificationType: faker.helpers.arrayElement(['Email', 'SMS', 'App', 'All']),
      reminderDays: days
    });
  });
  
  return reminders;
}

// Generate mock commissions
export const mockCommissions: Commission[] = [];

const commissionTypes: CommissionType[] = ['Standard', 'Referral', 'Pre-Construction', 'Commercial', 'Rental'];
const commissionStatuses: CommissionStatus[] = ['Pending', 'Partial', 'Paid', 'Overdue', 'Disputed'];

// Generate commissions based on sold listings
mockListings.filter(listing => listing.status === 'Sold').forEach(listing => {
  const id = uuidv4();
  const type: CommissionType = listing.propertyType === 'Commercial' 
    ? 'Commercial' 
    : (listing.propertyType === 'Pre-Construction' ? 'Pre-Construction' : 'Standard');
  
  const status = faker.helpers.arrayElement(commissionStatuses);
  const totalAmount = listing.financials.commissionAmount || 0;
  
  const paymentCount = status === 'Paid' 
    ? faker.number.int({ min: 1, max: 3 }) 
    : (status === 'Partial' ? faker.number.int({ min: 1, max: 2 }) : 0);
  
  const payments = paymentCount > 0 ? generateCommissionPayments(paymentCount, totalAmount) : [];
  const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  
  const brokeragePercentage = faker.number.float({ min: 30, max: 50, fractionDigits: 1 });
  const agentPercentage = 100 - brokeragePercentage;
  
  const brokerageAmount = Math.round((totalAmount * brokeragePercentage) / 100);
  const agentAmount = totalAmount - brokerageAmount;
  
  mockCommissions.push({
    id,
    listingId: listing.id,
    type,
    status,
    totalAmount,
    pendingAmount,
    paidAmount,
    dueDate: faker.date.future().toISOString(),
    brokeragePercentage,
    brokerageAmount,
    agentPercentage,
    agentAmount,
    payments,
    splits: faker.datatype.boolean(0.3) ? generateCommissionSplits(agentAmount) : undefined,
    reminders: generateCommissionReminders(faker.date.future().toISOString()),
    notes: faker.datatype.boolean(0.4) ? faker.lorem.paragraph() : undefined,
    attachments: faker.datatype.boolean(0.5) ? Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) }, 
      () => `/mock-documents/commission-${faker.string.alphanumeric(8)}.pdf`
    ) : undefined,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    createdById: faker.helpers.arrayElement(mockUsers).id
  });
});

// Generate additional pre-construction commissions with payment schedules
export const mockCommissionSchedules: CommissionSchedule[] = [];

// Add pre-construction listings with milestone payments
mockListings.filter(listing => listing.propertyType === 'Pre-Construction').forEach(listing => {
  const totalAmount = listing.financials.commissionAmount || 0;
  
  // Generate payment milestones
  const milestoneCount = faker.number.int({ min: 4, max: 7 });
  const milestones: PaymentMilestone[] = [];
  
  let remainingPercentage = 100;
  let remainingAmount = totalAmount;
  
  for (let i = 0; i < milestoneCount; i++) {
    const isLast = i === milestoneCount - 1;
    const percentage = isLast ? remainingPercentage : faker.number.int({ min: 5, max: 25 });
    remainingPercentage -= percentage;
    
    const amount = isLast ? remainingAmount : Math.round((totalAmount * percentage) / 100);
    remainingAmount -= amount;
    
    const isPaid = i === 0; // First milestone is paid
    
    milestones.push({
      id: uuidv4(),
      name: faker.helpers.arrayElement([
        'Deposit Received', 
        'Permit Approval', 
        'Foundation Complete', 
        'Framing Complete', 
        'Interior Complete',
        'Final Inspection',
        'Closing'
      ]),
      percentage,
      amount,
      dueDate: faker.date.future({ years: faker.number.int({ min: 1, max: 4 }) }).toISOString(),
      isPaid,
      paidDate: isPaid ? faker.date.recent().toISOString() : undefined,
      paymentId: isPaid ? uuidv4() : undefined,
      notes: faker.datatype.boolean(0.4) ? faker.lorem.sentence() : undefined,
      reminderSent: faker.datatype.boolean(0.2)
    });
  }
  
  mockCommissionSchedules.push({
    id: uuidv4(),
    listingId: listing.id,
    totalAmount,
    milestones: milestones.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  });
});

// Get commissions by status
export function getCommissionsByStatus(status: CommissionStatus): Commission[] {
  return mockCommissions.filter(commission => commission.status === status);
}

// Get commissions by agent
export function getCommissionsByAgent(agentId: string): Commission[] {
  return mockCommissions.filter(commission => {
    const listing = mockListings.find(l => l.id === commission.listingId);
    return listing && listing.agentId === agentId;
  });
}

// Get a single commission by ID
export function getCommissionById(id: string): Commission | undefined {
  return mockCommissions.find(commission => commission.id === id);
}

// Get commission schedules by listing ID
export function getCommissionScheduleByListingId(listingId: string): CommissionSchedule | undefined {
  return mockCommissionSchedules.find(schedule => schedule.listingId === listingId);
}

// Pending commissions for dashboard
export const pendingCommissions = getCommissionsByStatus('Pending');

// Overdue commissions for alerts
export const overdueCommissions = getCommissionsByStatus('Overdue');

// Upcoming commission milestones (due in the next 30 days)
export const upcomingMilestones = mockCommissionSchedules.flatMap(schedule => 
  schedule.milestones.filter(milestone => {
    if (milestone.isPaid) return false;
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return dueDate > now && dueDate < thirtyDaysFromNow;
  })
).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

// Recent payments
export const recentPayments = mockCommissions
  .flatMap(comm => comm.payments)
  .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
  .slice(0, 10);
 