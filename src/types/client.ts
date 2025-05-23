export type ClientType = 
  | 'Buyer'
  | 'Seller'
  | 'Both'
  | 'Developer'
  | 'Investor';

export type ClientStatus = 
  | 'Active'
  | 'Inactive'
  | 'Lead'
  | 'Past';

export interface ClientContact {
  email: string;
  phone: string;
  alternatePhone?: string;
  preferredContactMethod: 'Email' | 'Phone' | 'Text';
}

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ClientPreference {
  propertyTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  locations: string[];
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
}

export interface ClientInteraction {
  id: string;
  date: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Showing' | 'Offer' | 'Other';
  notes: string;
  followUpDate?: string;
  createdBy: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: string;
  uploadedAt: string;
  url: string;
}

export interface Client {
  id: string;
  type: ClientType;
  status: ClientStatus;
  firstName: string;
  lastName: string;
  company?: string;
  contact: ClientContact;
  address?: ClientAddress;
  preferences?: ClientPreference;
  interactions: ClientInteraction[];
  documents: ClientDocument[];
  assignedAgentId: string;
  referralSource?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 