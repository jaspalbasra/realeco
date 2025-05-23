import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, UserStatus, Team } from '@/types/user';

// Generate consistent data for demo
faker.seed(123);

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Downtown Specialists',
    description: 'Focusing on downtown luxury properties and condos',
    leadId: 'user-1',
    memberIds: ['user-2', 'user-3', 'user-4'],
    logoUrl: '/logos/team-1.svg',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  {
    id: 'team-2',
    name: 'Suburban Experts',
    description: 'Specializing in family homes in suburban areas',
    leadId: 'user-5',
    memberIds: ['user-6', 'user-7'],
    logoUrl: '/logos/team-2.svg',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
];

export const mockUsers: User[] = [
  // Team 1 - Downtown Specialists
  {
    id: 'user-1',
    role: 'TeamLead',
    status: 'Active',
    profile: {
      firstName: 'Michael',
      lastName: 'Rodriguez',
      email: 'michael.rodriguez@realtech.com',
      phone: faker.phone.number(),
      avatar: `https://i.pravatar.cc/150?u=${faker.internet.email()}`,
      title: 'Senior Real Estate Agent',
      bio: 'Over 15 years of experience in downtown properties',
      licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
      website: 'https://michaelrodriguez.com',
      socialMedia: {
        linkedin: 'linkedin.com/in/michaelrodriguez',
        twitter: 'twitter.com/mrodriguez',
        instagram: 'instagram.com/mrodriguez_realty',
      },
    },
    teamId: 'team-1',
    permissions: {
      canManageUsers: true,
      canManageTeams: true,
      canViewAllListings: true,
      canEditAllListings: true,
      canViewAllClients: true,
      canEditAllClients: true,
      canViewAllCommissions: true,
      canManageCommissions: true,
      canAccessMarketplace: true,
      canConfigureSettings: false,
    },
    stats: {
      activeListings: 12,
      soldListings: 87,
      totalRevenue: 1250000,
      pendingCommissions: 78500,
      clientCount: 45,
      conversionRate: 0.68,
      averageDaysOnMarket: 28,
      averageSalePrice: 875000,
    },
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
      commissionReminders: true,
      documentUpdates: true,
      newLeads: true,
      marketplaceActivity: true,
      systemUpdates: true,
    },
    lastActive: faker.date.recent().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  {
    id: 'user-2',
    role: 'Agent',
    status: 'Active',
    profile: {
      firstName: 'Sophia',
      lastName: 'Chen',
      email: 'sophia.chen@realtech.com',
      phone: faker.phone.number(),
      avatar: `https://i.pravatar.cc/150?u=${faker.internet.email()}`,
      title: 'Luxury Condo Specialist',
      bio: 'Specializing in high-end condos and apartments',
      licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
    },
    teamId: 'team-1',
    permissions: {
      canManageUsers: false,
      canManageTeams: false,
      canViewAllListings: false,
      canEditAllListings: false,
      canViewAllClients: false,
      canEditAllClients: false,
      canViewAllCommissions: false,
      canManageCommissions: false,
      canAccessMarketplace: true,
      canConfigureSettings: false,
    },
    stats: {
      activeListings: 8,
      soldListings: 42,
      totalRevenue: 680000,
      pendingCommissions: 45000,
      clientCount: 28,
      conversionRate: 0.72,
      averageDaysOnMarket: 22,
      averageSalePrice: 925000,
    },
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      commissionReminders: true,
      documentUpdates: true,
      newLeads: true,
      marketplaceActivity: true,
      systemUpdates: false,
    },
    lastActive: faker.date.recent().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
  // Add more users as needed
  {
    id: 'user-admin',
    role: 'Admin',
    status: 'Active',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@realtech.com',
      phone: faker.phone.number(),
      avatar: `https://i.pravatar.cc/150?u=${faker.internet.email()}`,
      title: 'System Administrator',
    },
    permissions: {
      canManageUsers: true,
      canManageTeams: true,
      canViewAllListings: true,
      canEditAllListings: true,
      canViewAllClients: true,
      canEditAllClients: true,
      canViewAllCommissions: true,
      canManageCommissions: true,
      canAccessMarketplace: true,
      canConfigureSettings: true,
    },
    stats: {
      activeListings: 0,
      soldListings: 0,
      totalRevenue: 0,
      pendingCommissions: 0,
      clientCount: 0,
    },
    notificationPreferences: {
      email: true,
      push: true,
      sms: true,
      commissionReminders: true,
      documentUpdates: true,
      newLeads: true,
      marketplaceActivity: true,
      systemUpdates: true,
    },
    lastActive: faker.date.recent().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  },
];

// Function to generate additional mock users
export function generateMockUsers(count: number): User[] {
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = `generated-user-${i}`;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const role: UserRole = faker.helpers.arrayElement(['Agent', 'TeamLead', 'Admin', 'BrokerageOwner']);
    
    users.push({
      id,
      role,
      status: 'Active',
      profile: {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number(),
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        title: faker.person.jobTitle(),
        bio: faker.person.bio(),
        licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
      },
      teamId: faker.helpers.arrayElement([...mockTeams.map(team => team.id), undefined]),
      permissions: {
        canManageUsers: role === 'Admin' || role === 'BrokerageOwner',
        canManageTeams: role === 'Admin' || role === 'BrokerageOwner' || role === 'TeamLead',
        canViewAllListings: role !== 'Agent',
        canEditAllListings: role === 'Admin' || role === 'BrokerageOwner',
        canViewAllClients: role !== 'Agent',
        canEditAllClients: role === 'Admin' || role === 'BrokerageOwner',
        canViewAllCommissions: role !== 'Agent',
        canManageCommissions: role === 'Admin' || role === 'BrokerageOwner',
        canAccessMarketplace: true,
        canConfigureSettings: role === 'Admin' || role === 'BrokerageOwner',
      },
      stats: {
        activeListings: faker.number.int({ min: 0, max: 15 }),
        soldListings: faker.number.int({ min: 0, max: 100 }),
        totalRevenue: faker.number.int({ min: 50000, max: 2000000 }),
        pendingCommissions: faker.number.int({ min: 0, max: 100000 }),
        clientCount: faker.number.int({ min: 1, max: 50 }),
        conversionRate: faker.number.float({ min: 0.3, max: 0.9, fractionDigits: 2 }),
        averageDaysOnMarket: faker.number.int({ min: 15, max: 90 }),
        averageSalePrice: faker.number.int({ min: 200000, max: 1500000 }),
      },
      notificationPreferences: {
        email: faker.datatype.boolean(),
        push: faker.datatype.boolean(),
        sms: faker.datatype.boolean(),
        commissionReminders: faker.datatype.boolean(),
        documentUpdates: faker.datatype.boolean(),
        newLeads: faker.datatype.boolean(),
        marketplaceActivity: faker.datatype.boolean(),
        systemUpdates: faker.datatype.boolean(),
      },
      lastActive: faker.date.recent().toISOString(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  }
  
  return users;
}

// Current user for demo purposes
export const currentUser = mockUsers[0];

// Extended users list including generated ones
export const allUsers = [...mockUsers, ...generateMockUsers(5)]; 