import { create } from 'zustand';
import type { NavItem } from '~/constants/navigation';

export type NavbarState =
  | { type: 'closed' }
  | { type: 'expanded' }
  | { type: 'hovered'; navItem: NavItem };

export type Role = 'ROLE_STAFF' | 'ROLE_RESERVATION' | 'ROLE_COUNCIL';

interface Store {
  role?: Role;
  navbarState: NavbarState;
  // Actions
  expandNavbar: () => void;
  closeNavbar: () => void;
  hoverNavItem: (navItem: NavItem) => void;
}

export const useStore = create<Store>()((set) => ({
  role: undefined,
  navbarState: { type: 'closed' },
  expandNavbar: () => set({ navbarState: { type: 'expanded' } }),
  closeNavbar: () => set({ navbarState: { type: 'closed' } }),
  hoverNavItem: (navItem: NavItem) =>
    set({ navbarState: { type: 'hovered', navItem } }),
}));
