import { create } from 'zustand';
import { Staff } from '@/lib/types/database';

interface StaffPinState {
  isLocked: boolean;
  currentStaff: Staff | null;
  lockDevice: () => void;
  unlockDevice: (staff: Staff) => void;
}

export const useStaffPin = create<StaffPinState>((set) => ({
  isLocked: true,
  currentStaff: null,
  lockDevice: () => set({ isLocked: true, currentStaff: null }),
  unlockDevice: (staff) => set({ isLocked: false, currentStaff: staff }),
}));
