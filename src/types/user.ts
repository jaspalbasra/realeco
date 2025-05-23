export type UserRole = 
  | 'Agent'
  | 'TeamLead'
  | 'Admin'
  | 'BrokerageOwner';

export type UserStatus = 
  | 'Active'
  | 'Inactive'
  | 'Pending'
  | 'Suspended';

export interface UserPermissions {
  canManageUsers: boolean;
  canManageTeams: boolean;
  canViewAllListings: boolean;
  canEditAllListings: boolean;
  canViewAllClients: boolean;
  canEditAllClients: boolean;
  canViewAllCommissions: boolean;
  canManageCommissions: boolean;
  canAccessMarketplace: boolean;
  canConfigureSettings: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  title?: string;
  bio?: string;
  licenseNumber?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface UserStats {
  activeListings: number;
  soldListings: number;
  totalRevenue: number;
  pendingCommissions: number;
  clientCount: number;
  conversionRate?: number;
  averageDaysOnMarket?: number;
  averageSalePrice?: number;
}

export interface UserNotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  commissionReminders: boolean;
  documentUpdates: boolean;
  newLeads: boolean;
  marketplaceActivity: boolean;
  systemUpdates: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  teamId?: string;
  permissions: UserPermissions;
  stats: UserStats;
  notificationPreferences: UserNotificationPreferences;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  leadId: string;
  memberIds: string[];
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
} 