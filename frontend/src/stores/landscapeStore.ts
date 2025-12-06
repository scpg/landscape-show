/**
 * Zustand store for landscape state management.
 */

import { create } from 'zustand';
import type { Landscape, LandscapeListItem } from '@/types/landscape';
import { api } from '@/services/api';
import { YamlLineMapper } from '@/utils/yamlLineMapper';

// Highlight state for bidirectional editor-diagram synchronization
interface HighlightState {
  selectedNodeIds: string[];      // Selected system IDs from diagram
  selectedEdgeIds: string[];      // Selected connection IDs from diagram
  cursorLine: number | null;      // Current cursor line in YAML editor
  highlightedFromYaml: {          // Element under cursor in YAML
    type: 'system' | 'connection' | null;
    id: string | null;
  };
  relatedEdgeIds: string[];       // Connections related to selected systems
  selectionSource: 'diagram' | 'yaml' | null; // Track selection source to prevent loops
}

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

  // Highlight state for bidirectional sync
  highlightState: HighlightState;

  // Actions
  loadLandscapes: () => Promise<void>;
  loadLandscape: (landscapeId: string) => Promise<void>;
  saveLandscape: (landscapeId: string, yamlContent: string) => Promise<void>;
  updateYaml: (yamlContent: string) => void;
  updateLandscape: (landscape: Landscape) => void;
  updatePositions: (landscapeId: string, updates: Record<string, { x: number; y: number }>) => Promise<void>;
  clearError: () => void;

  // Highlight actions
  setSelectedNodes: (nodeIds: string[], source?: 'diagram' | 'yaml') => void;
  setSelectedEdges: (edgeIds: string[], source?: 'diagram' | 'yaml') => void;
  setCursorLine: (line: number | null) => void;
  clearHighlights: () => void;
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

  // Initial highlight state
  highlightState: {
    selectedNodeIds: [],
    selectedEdgeIds: [],
    cursorLine: null,
    highlightedFromYaml: { type: null, id: null },
    relatedEdgeIds: [],
    selectionSource: null,
  },

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

  // Highlight actions

  // Set selected nodes from diagram
  setSelectedNodes: (nodeIds: string[], source: 'diagram' | 'yaml' = 'diagram') => {
    const landscape = get().currentLandscape;
    if (!landscape) {
      return;
    }

    // Find related edges (connections where from or to matches selected systems)
    const relatedEdges = landscape.connections
      .filter(conn => nodeIds.includes(conn.from) || nodeIds.includes(conn.to))
      .map(conn => `${conn.from}-${conn.to}`);

    set((state) => ({
      highlightState: {
        ...state.highlightState,
        selectedNodeIds: nodeIds,
        relatedEdgeIds: relatedEdges,
        selectionSource: source,
      },
    }));
  },

  // Set selected edges from diagram
  setSelectedEdges: (edgeIds: string[], source: 'diagram' | 'yaml' = 'diagram') => {
    set((state) => ({
      highlightState: {
        ...state.highlightState,
        selectedEdgeIds: edgeIds,
        selectionSource: source,
      },
    }));
  },

  // Set cursor line from YAML editor
  setCursorLine: (line: number | null) => {
    const yamlContent = get().yamlContent;

    if (!yamlContent || line === null) {
      set((state) => ({
        highlightState: {
          ...state.highlightState,
          cursorLine: line,
          highlightedFromYaml: { type: null, id: null },
          selectionSource: 'yaml',
        },
      }));
      return;
    }

    // Parse YAML structure to find which element cursor is in
    const highlighted = YamlLineMapper.getElementAtLine(yamlContent, line);

    set((state) => ({
      highlightState: {
        ...state.highlightState,
        cursorLine: line,
        highlightedFromYaml: highlighted,
        selectionSource: 'yaml',
      },
    }));
  },

  // Clear all highlights
  clearHighlights: () => {
    set((state) => ({
      highlightState: {
        selectedNodeIds: [],
        selectedEdgeIds: [],
        cursorLine: null,
        highlightedFromYaml: { type: null, id: null },
        relatedEdgeIds: [],
        selectionSource: null,
      },
    }));
  },
}));
