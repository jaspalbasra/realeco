import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { 
  MarketplaceLead, 
  MarketplaceLeadStatus, 
  MarketplaceLeadType, 
  MarketplaceLeadRequirements,
  MarketplaceBid,
  MarketplaceAnalytics,
  MarketplaceProvider,
  MarketplaceLeadSource
} from '@/types/marketplace';
import { mockUsers } from './mock-users';
import { mockClients } from './mock-clients';

// Generate consistent data for demo
faker.seed(753);

// Helper function to generate marketplace analytics
function generateMarketplaceAnalytics(): MarketplaceAnalytics {
  const views = faker.number.int({ min: 10, max: 500 });
  const uniqueViews = Math.floor(views * faker.number.float({ min: 0.5, max: 0.9, fractionDigits: 2 }));
  const bookmarks = faker.number.int({ min: 0, max: uniqueViews / 3 });
  const totalBids = faker.number.int({ min: 0, max: 20 });
  
  return {
    views,
    uniqueViews,
    bookmarks,
    totalBids,
    averageBid: totalBids > 0 ? faker.number.int({ min: 500, max: 10000 }) : undefined,
    highestBid: totalBids > 0 ? faker.number.int({ min: 1000, max: 15000 }) : undefined,
    matchScore: faker.number.float({ min: 0.3, max: 0.98, fractionDigits: 2 })
  };
}

// Helper function to generate marketplace bids
function generateMarketplaceBids(count: number, providers: MarketplaceProvider[]): MarketplaceBid[] {
  if (count === 0 || providers.length === 0) return [];
  
  const bids: MarketplaceBid[] = [];
  const usedProviders = new Set<string>();
  
  // Ensure we don't exceed the number of available providers
  const actualCount = Math.min(count, providers.length);
  
  for (let i = 0; i < actualCount; i++) {
    // Find a provider we haven't used yet
    let provider;
    do {
      provider = faker.helpers.arrayElement(providers);
    } while (usedProviders.has(provider.id) && usedProviders.size < providers.length);
    
    // If all providers have been used and we still need bids, start reusing
    if (usedProviders.has(provider.id) && usedProviders.size >= providers.length) {
      provider = providers[i % providers.length];
    }
    
    usedProviders.add(provider.id);
    
    const amount = faker.number.int({ min: 1000, max: 20000 });
    const createdAt = faker.date.recent().toISOString();
    const expiresInDays = faker.number.int({ min: 1, max: 14 });
    
    const expiresAt = new Date();
    expiresAt.setDate(new Date(createdAt).getDate() + expiresInDays);
    
    bids.push({
      id: uuidv4(),
      providerId: provider.id,
      providerType: provider.type,
      providerName: provider.name,
      amount,
      message: faker.lorem.paragraph(),
      offerDetails: faker.datatype.boolean(0.7) ? {
        rate: amount,
        terms: faker.lorem.sentence(),
        availableFrom: faker.date.soon().toISOString(),
        expiresAt: expiresAt.toISOString(),
        additionalServices: faker.datatype.boolean(0.5) ? [
          faker.commerce.productName(),
          faker.commerce.productName()
        ] : undefined
      } : undefined,
      createdAt,
      expiresAt: expiresAt.toISOString(),
      status: faker.helpers.arrayElement(['Pending', 'Accepted', 'Rejected', 'Expired'])
    });
  }
  
  return bids;
}

// Generate mock marketplace providers
export const mockMarketplaceProviders: MarketplaceProvider[] = [];

const providerTypes: MarketplaceLeadType[] = [
  'Mortgage', 'Insurance', 'Legal', 'Inspection', 'HomeWarranty'
];

// Generate 15 marketplace providers
for (let i = 0; i < 15; i++) {
  const id = `provider-${i + 1}`;
  const type = faker.helpers.arrayElement(providerTypes);
  const name = faker.company.name();
  const contactName = faker.person.fullName();
  
  const totalBids = faker.number.int({ min: 10, max: 200 });
  const wonBids = faker.number.int({ min: 1, max: totalBids });
  const conversion = parseFloat((wonBids / totalBids).toFixed(2));
  
  mockMarketplaceProviders.push({
    id,
    name,
    type,
    contactName,
    email: faker.internet.email({ firstName: contactName.split(' ')[0], lastName: contactName.split(' ')[1], provider: name.split(' ')[0].toLowerCase() }).toLowerCase(),
    phone: faker.phone.number(),
    website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    logoUrl: `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.com`,
    description: faker.company.catchPhrase(),
    servicesOffered: Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) }, 
      () => faker.commerce.productName()
    ),
    areasServed: Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) }, 
      () => faker.location.city()
    ),
    ratings: {
      average: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
      count: faker.number.int({ min: 5, max: 500 })
    },
    verified: faker.datatype.boolean(0.7),
    joinedDate: faker.date.past({ years: 2 }).toISOString(),
    bidHistory: {
      total: totalBids,
      won: wonBids,
      conversion
    }
  });
}

// Extended interface to match all the properties we're using
interface ExtendedMarketplaceLead extends MarketplaceLead {
  type: MarketplaceLeadType;
  title: string;
  description: string;
  requirements: any;
  expiresAt: string;
  bids: any[];
  analytics: any;
  agentId: string;
  updatedAt: string;
  isAnonymous?: boolean;
}

// Generate mock marketplace leads
export const mockMarketplaceLeads: ExtendedMarketplaceLead[] = [];

const leadTypes: MarketplaceLeadType[] = ['Buyer', 'Mortgage', 'Insurance', 'Legal', 'Inspection', 'HomeWarranty'];
const leadStatuses: MarketplaceLeadStatus[] = ['Open', 'Pending', 'Closed', 'Expired'];

// Generate 15 marketplace leads
for (let i = 0; i < 15; i++) {
  const id = uuidv4();
  const type = faker.helpers.arrayElement(leadTypes);
  const status = faker.helpers.arrayElement(leadStatuses);
  const isAnonymous = faker.datatype.boolean(0.7);
  
  const requirements: any = {
    budget: {
      min: faker.number.int({ min: 50000, max: 500000 }),
      max: faker.number.int({ min: 500000, max: 2000000 })
    },
    location: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) }, 
      () => faker.location.city()
    ),
    timeframe: faker.helpers.arrayElement([
      'Immediate', 
      'Within 30 days', 
      'Within 60 days', 
      '3-6 months', 
      '6-12 months'
    ]),
    propertyType: faker.helpers.arrayElements([
      'Single Family', 
      'Condo', 
      'Townhouse', 
      'Multi-Family', 
      'Land'
    ], faker.number.int({ min: 1, max: 3 })),
    additionalRequirements: faker.datatype.boolean(0.6) ? Array.from(
      { length: faker.number.int({ min: 1, max: 4 }) }, 
      () => faker.lorem.sentence(4)
    ) : undefined
  };
  
  const relevantProviders = mockMarketplaceProviders.filter(
    provider => type === 'Buyer' || provider.type === type
  );
  
  const bidCount = status === 'Open' 
    ? faker.number.int({ min: 0, max: 5 }) 
    : (status === 'Pending' ? faker.number.int({ min: 1, max: 8 }) : faker.number.int({ min: 1, max: 10 }));
  
  const bids = generateMarketplaceBids(bidCount, relevantProviders);
  const analytics = generateMarketplaceAnalytics();
  analytics.totalBids = bids.length;
  
  const createdAt = faker.date.past().toISOString();
  const expiresInDays = faker.number.int({ min: 7, max: 30 });
  
  const expiresAt = new Date();
  expiresAt.setDate(new Date(createdAt).getDate() + expiresInDays);
  
  // Standard fields for MarketplaceLead
  const lead: ExtendedMarketplaceLead = {
    id,
    name: `${type} Lead ${i + 1}`,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    source: faker.helpers.arrayElement(['Website', 'Referral', 'Marketing', 'Social Media', 'Other'] as const) as MarketplaceLeadSource,
    status,
    createdAt,
    lastContactedAt: faker.date.recent().toISOString(),
    notes: faker.lorem.paragraph(),
    tags: faker.helpers.arrayElements(['Hot', 'VIP', 'New', 'Follow-up'], faker.number.int({ min: 0, max: 3 })),
    value: faker.number.int({ min: 1000, max: 50000 }),
    data: {},
    
    // Extended fields
    title: `${type} Lead - ${faker.lorem.words(3)}`,
    type,
    description: faker.lorem.paragraphs(2),
    requirements,
    bids,
    analytics,
    isAnonymous,
    expiresAt: expiresAt.toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    agentId: faker.helpers.arrayElement(mockUsers.filter(u => u.role === 'Agent' || u.role === 'TeamLead')).id
  };
  
  mockMarketplaceLeads.push(lead);
}

// Get leads by type
export function getLeadsByType(type: MarketplaceLeadType): MarketplaceLead[] {
  return mockMarketplaceLeads.filter(lead => lead.type === type);
}

// Get leads by status
export function getLeadsByStatus(status: MarketplaceLeadStatus): MarketplaceLead[] {
  return mockMarketplaceLeads.filter(lead => lead.status === status);
}

// Get leads by agent
export function getLeadsByAgent(agentId: string): MarketplaceLead[] {
  return mockMarketplaceLeads.filter(lead => lead.agentId === agentId);
}

// Get a single lead by ID
export function getLeadById(id: string): MarketplaceLead | undefined {
  return mockMarketplaceLeads.find(lead => lead.id === id);
}

// Get providers by type
export function getProvidersByType(type: MarketplaceLeadType | string): MarketplaceProvider[] {
  return mockMarketplaceProviders.filter(provider => provider.type === type);
}

// Get a single provider by ID
export function getProviderById(id: string): MarketplaceProvider | undefined {
  return mockMarketplaceProviders.find(provider => provider.id === id);
}

// Active leads for default display
export const activeLeads = getLeadsByStatus('Open');

// Recent leads (sorted by creation date)
export const recentLeads = [...mockMarketplaceLeads].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
).slice(0, 10); 