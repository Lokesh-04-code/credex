/**
 * Zustand Store — AI Spend Audit
 *
 * Handles:
 * - Form state (with localStorage persistence)
 * - Audit results
 * - Lead capture state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Default tool entry
const defaultToolEntry = (toolId) => ({
  toolId,
  plan: '',
  monthlySpend: '',
  seats: 1,
});

const useAuditStore = create(
  persist(
    (set, get) => ({
      // ── Form State ──────────────────────────────────────────────────────
      selectedTools: [],          // Array of toolIds the user has checked
      toolEntries: {},             // { toolId: { plan, monthlySpend, seats } }
      teamSize: '',
      primaryUseCase: '',

      // ── Audit Results (not persisted) ───────────────────────────────────
      auditResult: null,
      auditError: null,
      isLoading: false,

      // ── Lead Capture ────────────────────────────────────────────────────
      leadCaptured: false,

      // ── Form Actions ────────────────────────────────────────────────────
      toggleTool: (toolId) => {
        const { selectedTools, toolEntries } = get();
        if (selectedTools.includes(toolId)) {
          set({
            selectedTools: selectedTools.filter((id) => id !== toolId),
          });
        } else {
          set({
            selectedTools: [...selectedTools, toolId],
            toolEntries: {
              ...toolEntries,
              [toolId]: toolEntries[toolId] || defaultToolEntry(toolId),
            },
          });
        }
      },

      updateToolEntry: (toolId, field, value) => {
        const { toolEntries } = get();
        set({
          toolEntries: {
            ...toolEntries,
            [toolId]: {
              ...(toolEntries[toolId] || defaultToolEntry(toolId)),
              [field]: value,
            },
          },
        });
      },

      setTeamSize: (value) => set({ teamSize: value }),
      setPrimaryUseCase: (value) => set({ primaryUseCase: value }),

      // ── Audit Actions ────────────────────────────────────────────────────
      setLoading: (isLoading) => set({ isLoading }),
      setAuditResult: (result) => set({ auditResult: result, auditError: null }),
      setAuditError: (error) => set({ auditError: error, auditResult: null }),

      // ── Lead Actions ─────────────────────────────────────────────────────
      setLeadCaptured: () => set({ leadCaptured: true }),

      // ── Reset ─────────────────────────────────────────────────────────────
      resetForm: () =>
        set({
          selectedTools: [],
          toolEntries: {},
          teamSize: '',
          primaryUseCase: '',
          auditResult: null,
          auditError: null,
          isLoading: false,
          leadCaptured: false,
        }),

      // ── Computed helpers (used in multiple components) ───────────────────
      getToolsPayload: () => {
        const { selectedTools, toolEntries } = get();
        return selectedTools
          .filter((toolId) => {
            const entry = toolEntries[toolId];
            return entry && entry.plan;
          })
          .map((toolId) => {
            const entry = toolEntries[toolId];
            return {
              toolId,
              plan: entry.plan,
              monthlySpend: parseFloat(entry.monthlySpend) || 0,
              seats: parseInt(entry.seats) || 1,
            };
          });
      },
    }),
    {
      name: 'ai-spend-audit-v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist form state, not results
      partialize: (state) => ({
        selectedTools: state.selectedTools,
        toolEntries: state.toolEntries,
        teamSize: state.teamSize,
        primaryUseCase: state.primaryUseCase,
      }),
    }
  )
);

export default useAuditStore;
