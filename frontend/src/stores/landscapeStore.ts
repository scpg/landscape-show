/**
 * Zustand store for landscape state management.
 */

import { create } from 'zustand';
import type { Landscape, LandscapeListItem } from '@/types/landscape';
import { api } from '@/services/api';

interface LandscapeState {
  // Current landscape
  currentLandscape: Landscape | null;
  currentLandscapeId: string | null;
  yamlContent: string;

  // List of available landscapes
  landscapes: LandscapeListItem[];

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  loadLandscapes: () => Promise<void>;
  loadLandscape: (landscapeId: string) => Promise<void>;
  saveLandscape: (landscapeId: string, yamlContent: string) => Promise<void>;
  updateYaml: (yamlContent: string) => void;
  updateLandscape: (landscape: Landscape) => void;
  updatePositions: (landscapeId: string, updates: Record<string, { x: number; y: number }>) => Promise<void>;
  clearError: () => void;
}

export const useLandscapeStore = create<LandscapeState>((set, get) => ({
  // Initial state
  currentLandscape: null,
  currentLandscapeId: null,
  yamlContent: '',
  landscapes: [],
  isLoading: false,
  isSaving: false,
  error: null,

  // Load list of landscapes
  loadLandscapes: async () => {
    set({ isLoading: true, error: null });
    try {
      const landscapes = await api.listLandscapes();
      set({ landscapes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load landscapes',
        isLoading: false,
      });
    }
  },

  // Load a specific landscape
  loadLandscape: async (landscapeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getLandscape(landscapeId);
      set({
        currentLandscape: response.parsed,
        currentLandscapeId: landscapeId,
        yamlContent: response.yaml,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load landscape',
        isLoading: false,
      });
    }
  },

  // Save landscape
  saveLandscape: async (landscapeId: string, yamlContent: string) => {
    set({ isSaving: true, error: null });
    try {
      const exists = get().landscapes.some((l) => l.id === landscapeId);

      if (exists) {
        await api.updateLandscape(landscapeId, yamlContent);
      } else {
        await api.createLandscape(landscapeId, yamlContent);
      }

      set({ isSaving: false });
      // Reload the landscape to get updated data
      await get().loadLandscape(landscapeId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save landscape',
        isSaving: false,
      });
    }
  },

  // Update YAML content (local only)
  updateYaml: (yamlContent: string) => {
    set({ yamlContent });
  },

  // Update landscape object (local only)
  updateLandscape: (landscape: Landscape) => {
    set({ currentLandscape: landscape });
  },

  // Update positions
  updatePositions: async (landscapeId: string, updates: Record<string, { x: number; y: number }>) => {
    try {
      await api.updatePositions(landscapeId, { updates });
      // Reload to get updated YAML
      await get().loadLandscape(landscapeId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update positions',
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
