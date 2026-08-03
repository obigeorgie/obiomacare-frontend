import { create } from 'zustand';

interface AnatomyLabState {
  viewedOrgans: Record<string, string[]>;
  markOrganViewed: (system: string, organId: string) => void;
}

export const useAnatomyLabStore = create<AnatomyLabState>((set) => ({
  viewedOrgans: {},
  markOrganViewed: (system, organId) =>
    set((state) => ({
      viewedOrgans: {
        ...state.viewedOrgans,
        [system]: [...(state.viewedOrgans[system] || []), organId],
      },
    })),
}));
