import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Listing, PropertyType, ListingStatus, Document, DocumentType, PropertyLocation, PropertyDetails, ListingFinancials, PaymentMilestone } from '@/types/listing';
import { mockUsers } from './mock-users';

// Generate consistent data for demo
faker.seed(456);

// Extended Document interface for our mock data
interface ExtendedDocument extends Document {
  uploadedAt?: string;
  processed?: boolean;
  extractedData?: {
    propertyAddress: string;
    clientName: string;
    price: string;
    date: string;
  };
}

// Helper function to generate mock documents
function generateDocuments(count: number): ExtendedDocument[] {
  const documents: ExtendedDocument[] = [];
  const documentTypes: Document['type'][] = [
    'Listing Agreement',
    'Purchase Agreement',
    'Inspection Report',
    'Appraisal',
    'Floor Plan',
    'Title Document',
    'Other'
  ];
  
  for (let i = 0; i < count; i++) {
    const docType = faker.helpers.arrayElement(documentTypes);
    documents.push({
      id: uuidv4(),
      name: `${docType} - ${faker.lorem.words(2)}.pdf`,
      type: docType,
      size: faker.number.int({ min: 100000, max: 5000000 }),
      url: `/documents/sample-${i + 1}.pdf`,
      uploadedAt: faker.date.recent({ days: 30 }).toISOString(),
      dateAdded: faker.date.recent({ days: 30 }).toISOString(),
      processed: faker.datatype.boolean(0.8),
      extractedData: faker.datatype.boolean(0.7) ? {
        propertyAddress: faker.location.streetAddress(),
        clientName: faker.person.fullName(),
        price: `${faker.commerce.price({ min: 100000, max: 2000000 })}`,
        date: faker.date.recent().toISOString()
      } : undefined
    });
  }
  
  return documents;
}

// Helper function to generate payment milestones for pre-construction
function generatePaymentMilestones(totalAmount: number): PaymentMilestone[] {
  const milestones: PaymentMilestone[] = [];
  const milestoneNames = [
    'Initial Deposit',
    'Permit Approval',
    'Foundation Complete',
    'Frame Complete',
    'Roof Complete',
    'Occupancy',
    'Final Closing'
  ];
  
  let remainingPercentage = 100;
  let remainingAmount = totalAmount;
  
  milestoneNames.forEach((name, index) => {
    const isFirst = index === 0;
    const isLast = index === milestoneNames.length - 1;
    
    // For the first and last milestones, use fixed percentages
    let percentage = isFirst ? 20 : (isLast ? remainingPercentage : faker.number.int({ min: 5, max: 20 }));
    
    // Ensure we don't exceed 100%
    if (!isLast && percentage > remainingPercentage - 5) {
      percentage = Math.max(5, remainingPercentage - 5);
    }
    
    remainingPercentage -= percentage;
    
    const amount = isLast 
      ? remainingAmount 
      : Math.round((totalAmount * percentage) / 100);
    
    remainingAmount -= amount;
    
    const isPaid = index < 2; // First two milestones are paid
    
    milestones.push({
      id: uuidv4(),
      name,
      percentage,
      amount,
      dueDate: faker.date.future({ years: 3 }).toISOString(),
      isPaid,
      paidDate: isPaid ? faker.date.recent().toISOString() : undefined
    });
  });
  
  return milestones;
}

// Generate mock listings
export const mockListings: Listing[] = [];

// Helper to create addresses in different cities
const cities = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Boston'];
const propertyTypes: PropertyType[] = ['Residential', 'Commercial', 'Land', 'Industrial', 'Mixed-Use', 'Pre-Construction'];
const listingStatuses: ListingStatus[] = ['Active', 'Pending', 'Sold', 'Off-Market', 'Coming Soon', 'Under Contract'];

// Generate 25 properties
for (let i = 0; i < 25; i++) {
  const id = uuidv4();
  const propertyType = faker.helpers.arrayElement(propertyTypes);
  const status = faker.helpers.arrayElement(listingStatuses);
  const isPreConstruction = propertyType === 'Pre-Construction';
  const isSold = status === 'Sold';
  
  const listPrice = faker.number.int({ 
    min: propertyType === 'Commercial' ? 500000 : 200000, 
    max: propertyType === 'Commercial' ? 10000000 : 2000000 
  });
  
  const soldPrice = isSold ? listPrice * (1 + faker.number.float({ min: -0.1, max: 0.2, fractionDigits: 2 })) : undefined;
  
  const commission = faker.number.float({ min: 2.5, max: 6, fractionDigits: 1 });
  const commissionAmount = isSold && soldPrice 
    ? Math.round((soldPrice * commission) / 100) 
    : Math.round((listPrice * commission) / 100);

  const location: PropertyLocation = {
    address: faker.location.streetAddress(),
    city: faker.helpers.arrayElement(cities),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: 'USA',
    latitude: Number(faker.location.latitude()),
    longitude: Number(faker.location.longitude())
  };

  const details: PropertyDetails = {
    bedrooms: propertyType === 'Residential' ? faker.number.int({ min: 1, max: 6 }) : undefined,
    bathrooms: propertyType === 'Residential' ? faker.number.int({ min: 1, max: 5 }) : undefined,
    squareFeet: faker.number.int({ min: 500, max: 10000 }),
    lotSize: faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 }),
    yearBuilt: faker.number.int({ min: 1950, max: 2023 }),
    description: faker.lorem.paragraphs(3),
    features: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => faker.lorem.sentence())
  };

  const paymentSchedule = isPreConstruction 
    ? generatePaymentMilestones(listPrice) 
    : undefined;

  const financials: ListingFinancials = {
    listPrice,
    soldPrice,
    commission,
    commissionAmount,
    closingCosts: isSold ? Math.round(listPrice * 0.02) : undefined,
    propertyTaxes: Math.round(listPrice * 0.01),
    preConstructionPaymentSchedule: paymentSchedule
  };

  const agentId = faker.helpers.arrayElement(mockUsers.filter(user => user.role === 'Agent' || user.role === 'TeamLead')).id;

  mockListings.push({
    id,
    mlsNumber: `MLS-${faker.string.alphanumeric(8).toUpperCase()}`,
    title: faker.lorem.words({ min: 3, max: 6 }),
    propertyType,
    status,
    location,
    details,
    financials,
    listedDate: faker.date.past().toISOString(),
    soldDate: isSold ? faker.date.recent().toISOString() : undefined,
    documents: generateDocuments(faker.number.int({ min: 1, max: 5 })),
    clientId: `client-${faker.number.int({ min: 1, max: 20 })}`,
    agentId,
    photos: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) }, 
      (_, i) => `https://source.unsplash.com/random/800x600?property,house&sig=${id}-${i}`
    ),
    virtualTourUrl: faker.datatype.boolean(0.3) ? `https://my.matterport.com/show/?m=${faker.string.alphanumeric(12)}` : undefined,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  });
}

// Get listings by property type
export function getListingsByPropertyType(propertyType: PropertyType): Listing[] {
  return mockListings.filter(listing => listing.propertyType === propertyType);
}

// Get listings by status
export function getListingsByStatus(status: ListingStatus): Listing[] {
  return mockListings.filter(listing => listing.status === status);
}

// Get listings by agent
export function getListingsByAgent(agentId: string): Listing[] {
  return mockListings.filter(listing => listing.agentId === agentId);
}

// Get a single listing by ID
export function getListingById(id: string): Listing | undefined {
  return mockListings.find(listing => listing.id === id);
}

// Active listings for default display
export const activeListings = getListingsByStatus('Active');

// Recent listings (sorted by creation date)
export const recentListings = [...mockListings].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
).slice(0, 10); 