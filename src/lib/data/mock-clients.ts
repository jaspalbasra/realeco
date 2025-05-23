import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { 
  Client, 
  ClientType, 
  ClientStatus, 
  ClientContact, 
  ClientAddress, 
  ClientPreference,
  ClientInteraction,
  ClientDocument
} from '@/types/client';
import { mockUsers } from './mock-users';

// Generate consistent data for demo
faker.seed(789);

// Helper function to generate client interactions
function generateClientInteractions(count: number): ClientInteraction[] {
  const interactions: ClientInteraction[] = [];
  const interactionTypes = ['Call', 'Email', 'Meeting', 'Showing', 'Offer', 'Other'] as const;

  for (let i = 0; i < count; i++) {
    const date = faker.date.past();
    interactions.push({
      id: uuidv4(),
      date: date.toISOString(),
      type: faker.helpers.arrayElement(interactionTypes),
      notes: faker.lorem.paragraph(),
      followUpDate: faker.datatype.boolean(0.6) ? faker.date.future({ refDate: date }).toISOString() : undefined,
      createdBy: faker.helpers.arrayElement(mockUsers).id
    });
  }

  // Sort by date descending (newest first)
  return interactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Helper function to generate client documents
function generateClientDocuments(count: number): ClientDocument[] {
  const documents: ClientDocument[] = [];
  const documentTypes = ['ID', 'Contract', 'Proof of Funds', 'Pre-Approval', 'Financial Statement', 'Other'];

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(documentTypes);
    documents.push({
      id: uuidv4(),
      title: `${type} - ${faker.lorem.word()}`,
      type,
      uploadedAt: faker.date.recent().toISOString(),
      url: `/mock-documents/client-${type.toLowerCase().replace(/\s+/g, '-')}.pdf`
    });
  }

  return documents;
}

// Helper function to generate client preferences
function generateClientPreferences(): ClientPreference {
  const propertyTypes = ['Single Family Home', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial', 'Land'];
  const features = [
    'Garage', 'Pool', 'Garden', 'Fireplace', 'Basement', 'Home Office',
    'Open Floor Plan', 'Modern Kitchen', 'Waterfront', 'Mountain View',
    'Smart Home', 'Solar Panels', 'High Ceilings', 'Hardwood Floors'
  ];
  
  const locations = [];
  const locationCount = faker.number.int({ min: 1, max: 3 });
  
  for (let i = 0; i < locationCount; i++) {
    locations.push(faker.location.city());
  }
  
  return {
    propertyTypes: faker.helpers.arrayElements(propertyTypes, faker.number.int({ min: 1, max: 3 })),
    priceRange: {
      min: faker.number.int({ min: 100000, max: 500000 }),
      max: faker.number.int({ min: 500000, max: 2000000 })
    },
    locations,
    mustHaveFeatures: faker.helpers.arrayElements(features, faker.number.int({ min: 1, max: 5 })),
    niceToHaveFeatures: faker.helpers.arrayElements(
      features.filter(f => !features.includes(f)),
      faker.number.int({ min: 1, max: 5 })
    )
  };
}

// Generate mock clients
export const mockClients: Client[] = [];

const clientTypes: ClientType[] = ['Buyer', 'Seller', 'Both', 'Developer', 'Investor'];
const clientStatuses: ClientStatus[] = ['Active', 'Inactive', 'Lead', 'Past'];
const contactMethods = ['Email', 'Phone', 'Text'] as const;

// Generate 20 clients
for (let i = 0; i < 20; i++) {
  const id = `client-${i + 1}`;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const type = faker.helpers.arrayElement(clientTypes);
  const status = faker.helpers.arrayElement(clientStatuses);
  
  const contact: ClientContact = {
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number(),
    alternatePhone: faker.datatype.boolean(0.3) ? faker.phone.number() : undefined,
    preferredContactMethod: faker.helpers.arrayElement(contactMethods)
  };

  const address: ClientAddress | undefined = faker.datatype.boolean(0.8) ? {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: 'USA'
  } : undefined;

  const preferences = faker.datatype.boolean(0.7) ? generateClientPreferences() : undefined;

  mockClients.push({
    id,
    type,
    status,
    firstName,
    lastName,
    company: type === 'Developer' || type === 'Investor' ? faker.company.name() : undefined,
    contact,
    address,
    preferences,
    interactions: generateClientInteractions(faker.number.int({ min: 1, max: 10 })),
    documents: generateClientDocuments(faker.number.int({ min: 0, max: 5 })),
    assignedAgentId: faker.helpers.arrayElement(mockUsers.filter(u => u.role === 'Agent' || u.role === 'TeamLead')).id,
    referralSource: faker.datatype.boolean(0.6) ? faker.helpers.arrayElement([
      'Website', 'Referral', 'Social Media', 'Open House', 'Advertisement', 'Previous Client'
    ]) : undefined,
    notes: faker.datatype.boolean(0.7) ? faker.lorem.paragraphs(2) : undefined,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  });
}

// Get clients by type
export function getClientsByType(type: ClientType): Client[] {
  return mockClients.filter(client => client.type === type);
}

// Get clients by status
export function getClientsByStatus(status: ClientStatus): Client[] {
  return mockClients.filter(client => client.status === status);
}

// Get clients by agent
export function getClientsByAgent(agentId: string): Client[] {
  return mockClients.filter(client => client.assignedAgentId === agentId);
}

// Get a single client by ID
export function getClientById(id: string): Client | undefined {
  return mockClients.find(client => client.id === id);
}

// Active clients for default display
export const activeClients = getClientsByStatus('Active');

// Recent clients (sorted by creation date)
export const recentClients = [...mockClients].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
).slice(0, 10); 