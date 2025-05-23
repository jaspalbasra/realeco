export type PropertyType = 
  | 'Residential'
  | 'Commercial'
  | 'Land'
  | 'Industrial'
  | 'Mixed-Use'
  | 'Pre-Construction';

export type ListingStatus = 
  | 'Active'
  | 'Pending'
  | 'Sold'
  | 'Off-Market'
  | 'Coming Soon'
  | 'Under Contract';

export type DocumentType = 
  | 'Listing Agreement'
  | 'Purchase Agreement'
  | 'Inspection Report'
  | 'Appraisal'
  | 'Floor Plan'
  | 'Title Document'
  | 'Other';

export interface Document {
  id?: string;
  name: string;
  type: 'Listing Agreement' | 'Purchase Agreement' | 'Inspection Report' | 'Appraisal' | 'Floor Plan' | 'Title Document' | 'Other';
  size: number;
  url: string;
  dateAdded?: string;
  extractedData?: Record<string, string>;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyDetails {
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;
  description: string;
  features: string[];
}

export interface ListingFinancials {
  listPrice: number;
  soldPrice?: number;
  commission: number; // percentage
  commissionAmount?: number;
  closingCosts?: number;
  propertyTaxes?: number;
  preConstructionPaymentSchedule?: PaymentMilestone[];
}

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface Listing {
  id: string;
  mlsNumber?: string;
  title: string;
  propertyType: PropertyType;
  status: ListingStatus;
  location: PropertyLocation;
  details: PropertyDetails;
  financials: ListingFinancials;
  listedDate: string;
  soldDate?: string;
  documents: Document[];
  clientId: string;
  agentId: string;
  photos: string[];
  virtualTourUrl?: string;
  createdAt: string;
  updatedAt: string;
} 