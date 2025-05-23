import { create } from 'zustand';
import { UserRole } from '@/types/user';

export type ViewMode = 'Agent' | 'TeamLead' | 'Admin';
export type ThemeMode = 'light' | 'dark' | 'system';
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

interface ViewState {
  // View mode (determines permissions and features)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // UI Preferences
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Theme and appearance
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Layout density
  layoutDensity: LayoutDensity;
  setLayoutDensity: (density: LayoutDensity) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  
  // Mobile view state
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  // View mode (defaults to Agent)
  viewMode: 'Agent',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // UI Preferences
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  // Theme and appearance
  themeMode: 'light',
  setThemeMode: (mode) => set({ themeMode: mode }),
  
  // Layout density
  layoutDensity: 'comfortable',
  setLayoutDensity: (density) => set({ layoutDensity: density }),
  
  // Search state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  
  // Mobile view state
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }))
}));

// Helper function to check if a feature is available in the current view mode
export function isFeatureAvailable(
  feature: string,
  viewMode: ViewMode
): boolean {
  // Define features available for each view mode
  const featureAccess: Record<string, ViewMode[]> = {
    // Dashboard features
    'view-all-teams-stats': ['TeamLead', 'Admin'],
    'edit-company-settings': ['Admin'],
    
    // Listing features
    'view-all-listings': ['TeamLead', 'Admin'],
    'edit-all-listings': ['Admin'],
    'delete-listings': ['Admin'],
    
    // Client features
    'view-all-clients': ['TeamLead', 'Admin'],
    'edit-all-clients': ['Admin'],
    'assign-clients': ['TeamLead', 'Admin'],
    
    // Commission features
    'view-all-commissions': ['TeamLead', 'Admin'],
    'edit-commission-splits': ['TeamLead', 'Admin'],
    'override-commission-rules': ['Admin'],
    
    // User management
    'manage-users': ['Admin'],
    'manage-teams': ['TeamLead', 'Admin'],
    
    // Marketplace features
    'create-marketplace-leads': ['Agent', 'TeamLead', 'Admin'],
    'approve-marketplace-providers': ['Admin'],
  };
  
  return featureAccess[feature]?.includes(viewMode) ?? false;
} 