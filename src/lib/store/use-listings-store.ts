import { create } from 'zustand';
import { Listing, PropertyType, ListingStatus, Document } from '@/types/listing';
import { mockListings, getListingById } from '@/lib/data/mock-listings';
import { delay, simulateAiProcessing } from '@/lib/utils';

// Extended interface to include processed property
interface ExtendedDocument extends Document {
  processed?: boolean;
}

interface ListingsState {
  // Listing data
  listings: Listing[];
  filteredListings: Listing[];
  selectedListing: Listing | null;
  
  // Listing actions
  selectListing: (id: string) => void;
  
  // Filtering
  filters: {
    status: ListingStatus | 'All';
    propertyType: PropertyType | 'All';
    priceMin: number | null;
    priceMax: number | null;
    searchQuery: string;
  };
  setStatusFilter: (status: ListingStatus | 'All') => void;
  setPropertyTypeFilter: (type: PropertyType | 'All') => void;
  setPriceRangeFilter: (min: number | null, max: number | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  
  // Document processing simulation
  processingDocument: ExtendedDocument | null;
  processingProgress: number;
  processingComplete: boolean;
  uploadAndProcessDocument: (document: ExtendedDocument, onComplete?: () => void) => Promise<ExtendedDocument | undefined>;
  resetDocumentProcessing: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  // Listing data
  listings: mockListings,
  filteredListings: mockListings,
  selectedListing: null,
  
  // Listing actions
  selectListing: (id) => {
    const listing = getListingById(id);
    set({ selectedListing: listing || null });
  },
  
  // Filtering
  filters: {
    status: 'All',
    propertyType: 'All',
    priceMin: null,
    priceMax: null,
    searchQuery: ''
  },
  
  setStatusFilter: (status) => set(state => ({
    filters: { ...state.filters, status }
  })),
  
  setPropertyTypeFilter: (propertyType) => set(state => ({
    filters: { ...state.filters, propertyType }
  })),
  
  setPriceRangeFilter: (priceMin, priceMax) => set(state => ({
    filters: { ...state.filters, priceMin, priceMax }
  })),
  
  setSearchQuery: (searchQuery) => set(state => ({
    filters: { ...state.filters, searchQuery }
  })),
  
  resetFilters: () => set({
    filters: {
      status: 'All',
      propertyType: 'All',
      priceMin: null,
      priceMax: null,
      searchQuery: ''
    }
  }),
  
  applyFilters: () => set(state => {
    const { status, propertyType, priceMin, priceMax, searchQuery } = state.filters;
    
    let filtered = [...state.listings];
    
    // Apply status filter
    if (status !== 'All') {
      filtered = filtered.filter(listing => listing.status === status);
    }
    
    // Apply property type filter
    if (propertyType !== 'All') {
      filtered = filtered.filter(listing => listing.propertyType === propertyType);
    }
    
    // Apply price range filters
    if (priceMin !== null) {
      filtered = filtered.filter(listing => listing.financials.listPrice >= priceMin);
    }
    
    if (priceMax !== null) {
      filtered = filtered.filter(listing => listing.financials.listPrice <= priceMax);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.location.address.toLowerCase().includes(query) ||
        listing.location.city.toLowerCase().includes(query) ||
        listing.mlsNumber?.toLowerCase().includes(query)
      );
    }
    
    return { filteredListings: filtered };
  }),
  
  // Document processing simulation
  processingDocument: null,
  processingProgress: 0,
  processingComplete: false,
  
  uploadAndProcessDocument: async (
    document: ExtendedDocument,
    onComplete?: () => void
  ): Promise<ExtendedDocument | undefined> => {
    // Set processing state
    set({ 
      processingDocument: document, 
      processingProgress: 0,
      processingComplete: false
    });
    
    // Simulate AI document processing
    await simulateAiProcessing((progress) => {
      set({ processingProgress: progress });
    }, 3000);
    
    // Create processed document with extracted data
    const processedDocument: ExtendedDocument = {
      ...get().processingDocument!,
      processed: true,
      extractedData: {
        propertyAddress: '123 Main Street, New York, NY 10001',
        listPrice: '$750,000',
        bedrooms: '3',
        bathrooms: '2',
        squareFeet: '1,850',
        lotSize: '0.25 acres',
        yearBuilt: '1998',
        propertyType: 'Single Family',
        clientName: 'John & Sarah Johnson',
        clientEmail: 'johnson@example.com',
        clientPhone: '(555) 123-4567',
        agentCommission: '2.5%',
        listingDate: '2023-10-15',
        expirationDate: '2024-04-15'
      }
    };
    
    // Simulate final processing delay
    await delay(500);
    
    set({ 
      processingDocument: processedDocument,
      processingComplete: true,
      isLoading: false
    });
    
    if (onComplete) {
      onComplete();
    }
    
    return processedDocument;
  },
  
  resetDocumentProcessing: () => set({
    processingDocument: null,
    processingProgress: 0,
    processingComplete: false
  }),
  
  // Loading states
  isLoading: false,
  error: null
})); 