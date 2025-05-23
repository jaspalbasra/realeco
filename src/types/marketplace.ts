export type MarketplaceLeadStatus = 
  | 'Open'
  | 'Pending'
  | 'Closed'
  | 'Expired';

export type MarketplaceLeadType = 
  | 'Buyer'
  | 'Mortgage'
  | 'Insurance'
  | 'Legal'
  | 'Inspection'
  | 'HomeWarranty';

export type MarketplaceLeadSource = 'Website' | 'Referral' | 'Marketing' | 'Social Media' | 'Other';

export interface MarketplaceLeadRequirements {
  budget?: {
    min: number;
    max: number;
  };
  location?: string[];
  timeframe?: string;
  propertyType?: string[];
  additionalRequirements?: string[];
}

export interface MarketplaceBid {
  id: string;
  providerId: string;
  providerType: string;
  providerName: string;
  amount: number;
  message: string;
  offerDetails?: Record<string, any>;
  createdAt: string;
  expiresAt: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
}

export interface MarketplaceAnalytics {
  views: number;
  uniqueViews: number;
  bookmarks: number;
  totalBids: number;
  averageBid?: number;
  highestBid?: number;
  matchScore?: number; // AI-powered match score for providers
}

export interface MarketplaceLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: MarketplaceLeadSource;
  status: MarketplaceLeadStatus;
  createdAt: string;
  lastContactedAt: string;
  notes: string;
  tags: string[];
  value: number;
  data: Record<string, string | number | boolean>;
}

export interface MarketplaceProvider {
  id: string;
  name: string;
  type: MarketplaceLeadType | string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  logoUrl?: string;
  description: string;
  servicesOffered: string[];
  areasServed: string[];
  ratings?: {
    average: number;
    count: number;
  };
  verified: boolean;
  joinedDate: string;
  bidHistory: {
    total: number;
    won: number;
    conversion: number;
  };
} 