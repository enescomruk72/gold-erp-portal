/**
 * Column Store Factory
 * 
 * Creates a Zustand store for column preferences (visibility, order, sizing, pinning).
 * Persisted to localStorage with versioning and migration support.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ColumnStoreState, CreateColumnStoreOptions, PersistedColumnPreferences } from '@/components/shared/data-table/types';
import { COLUMN_PREFERENCES_KEY } from '@/components/shared/data-table/config';

/**
 * Default column preferences
 */
const DEFAULT_PREFERENCES = {
    visibility: {},
    order: [],
    sizing: {},
    pinning: { left: [], right: [] },
};

/**
 * Create a column store for a specific table
 * 
 * @example
 * const useUserColumnsStore = createColumnStore({
 *   tableId: 'users-table',
 *   persist: true,
 *   defaultOrder: ['select', 'email', 'name', 'role']
 * });
 * 
 * // In component
 * const visibility = useUserColumnsStore(state => state.visibility);
 * const toggleVisibility = useUserColumnsStore(state => state.toggleVisibility);
 */
export function createColumnStore(options: CreateColumnStoreOptions) {
    const {
        tableId,
        persist: enablePersist = true,
        defaultVisibility = {},
        defaultOrder = [],
        defaultSizing = {},
        defaultPinning = { left: [], right: [] },
    } = options;

    const initialState = {
        visibility: defaultVisibility,
        order: defaultOrder,
        sizing: defaultSizing,
        pinning: defaultPinning,
    };

    // Create base store
    const useStore = create<ColumnStoreState>()(
        immer(
            enablePersist
                ? persist(
                    (set) => ({
                        // State
                        tableId,
                        visibility: initialState.visibility,
                        order: initialState.order,
                        sizing: initialState.sizing,
                        pinning: initialState.pinning,
                        hydrated: false,

                        // Visibility actions
                        toggleVisibility: (columnId: string) => {
                            set((state) => {
                                state.visibility[columnId] = !state.visibility[columnId];
                            });
                        },

                        setVisibility: (visibility: Record<string, boolean>) => {
                            set((state) => {
                                state.visibility = visibility;
                            });
                        },

                        // Order actions
                        setOrder: (order: string[]) => {
                            set((state) => {
                                state.order = order;
                            });
                        },

                        moveColumn: (fromIndex: number, toIndex: number) => {
                            set((state) => {
                                const newOrder = [...state.order];
                                const [removed] = newOrder.splice(fromIndex, 1);
                                newOrder.splice(toIndex, 0, removed);
                                state.order = newOrder;
                            });
                        },

                        // Sizing actions
                        setSize: (columnId: string, size: number) => {
                            set((state) => {
                                state.sizing[columnId] = size;
                            });
                        },

                        setSizing: (sizing: Record<string, number>) => {
                            set((state) => {
                                state.sizing = sizing;
                            });
                        },

                        // Pinning actions
                        pinLeft: (columnId: string) => {
                            set((state) => {
                                // Remove from right if exists
                                state.pinning.right = state.pinning.right.filter((id: string) => id !== columnId);

                                // Add to left if not exists
                                if (!state.pinning.left.includes(columnId)) {
                                    state.pinning.left.push(columnId);
                                }
                            });
                        },

                        pinRight: (columnId: string) => {
                            set((state) => {
                                // Remove from left if exists
                                state.pinning.left = state.pinning.left.filter((id: string) => id !== columnId);

                                // Add to right if not exists
                                if (!state.pinning.right.includes(columnId)) {
                                    state.pinning.right.push(columnId);
                                }
                            });
                        },

                        unpin: (columnId: string) => {
                            set((state) => {
                                state.pinning.left = state.pinning.left.filter((id: string) => id !== columnId);
                                state.pinning.right = state.pinning.right.filter((id: string) => id !== columnId);
                            });
                        },

                        setPinning: (pinning: { left: string[]; right: string[] }) => {
                            set((state) => {
                                state.pinning = pinning;
                            });
                        },

                        // Reset
                        reset: () => {
                            set((state) => {
                                state.visibility = initialState.visibility;
                                state.order = initialState.order;
                                state.sizing = initialState.sizing;
                                state.pinning = initialState.pinning;
                            });
                        },
                    }),
                    {
                        name: COLUMN_PREFERENCES_KEY(tableId),
                        storage: createJSONStorage(() => localStorage),
                        version: 1,

                        // Partial persistence - only persist preferences, not tableId/hydrated
                        partialize: (state) => ({
                            visibility: state.visibility,
                            order: state.order,
                            sizing: state.sizing,
                            pinning: state.pinning,
                        }),

                        // Migration function for version updates
                        migrate: (persistedState: unknown): PersistedColumnPreferences => {
                            // No migrations yet, but ready for future versions
                            return persistedState as PersistedColumnPreferences;
                        },

                        // On rehydration
                        onRehydrateStorage: () => {
                            return (state, error) => {
                                if (error) {
                                    console.error('Failed to rehydrate column store:', error);
                                }

                                if (state) {
                                    state.hydrated = true;
                                }
                            };
                        },
                    }
                )
                : (set) => ({
                    // Same state/actions but without persistence
                    tableId,
                    visibility: initialState.visibility,
                    order: initialState.order,
                    sizing: initialState.sizing,
                    pinning: initialState.pinning,
                    hydrated: true, // Always hydrated if not persisting

                    toggleVisibility: (columnId: string) => {
                        set((state) => {
                            state.visibility[columnId] = !state.visibility[columnId];
                        });
                    },

                    setVisibility: (visibility: Record<string, boolean>) => {
                        set((state) => {
                            state.visibility = visibility;
                        });
                    },

                    setOrder: (order: string[]) => {
                        set((state) => {
                            state.order = order;
                        });
                    },

                    moveColumn: (fromIndex: number, toIndex: number) => {
                        set((state) => {
                            const newOrder = [...state.order];
                            const [removed] = newOrder.splice(fromIndex, 1);
                            newOrder.splice(toIndex, 0, removed);
                            state.order = newOrder;
                        });
                    },

                    setSize: (columnId: string, size: number) => {
                        set((state) => {
                            state.sizing[columnId] = size;
                        });
                    },

                    setSizing: (sizing: Record<string, number>) => {
                        set((state) => {
                            state.sizing = sizing;
                        });
                    },

                    pinLeft: (columnId: string) => {
                        set((state) => {
                            state.pinning.right = state.pinning.right.filter((id: string) => id !== columnId);
                            if (!state.pinning.left.includes(columnId)) {
                                state.pinning.left.push(columnId);
                            }
                        });
                    },

                    pinRight: (columnId: string) => {
                        set((state) => {
                            state.pinning.left = state.pinning.left.filter((id: string) => id !== columnId);
                            if (!state.pinning.right.includes(columnId)) {
                                state.pinning.right.push(columnId);
                            }
                        });
                    },

                    unpin: (columnId: string) => {
                        set((state) => {
                            state.pinning.left = state.pinning.left.filter((id: string) => id !== columnId);
                            state.pinning.right = state.pinning.right.filter((id: string) => id !== columnId);
                        });
                    },

                    setPinning: (pinning: { left: string[]; right: string[] }) => {
                        set((state) => {
                            state.pinning = pinning;
                        });
                    },

                    reset: () => {
                        set((state) => {
                            state.visibility = initialState.visibility;
                            state.order = initialState.order;
                            state.sizing = initialState.sizing;
                            state.pinning = initialState.pinning;
                        });
                    },
                })
        )
    );

    return useStore;
}

/**
 * Store instance cache to ensure single instance per tableId
 */
const storeCache = new Map<string, ReturnType<typeof createColumnStore>>();

/**
 * Get or create a column store for a table
 * Ensures singleton pattern - one store per tableId
 * 
 * @example
 * const store = getColumnStore('users-table');
 * const visibility = store(state => state.visibility);
 */
export function getColumnStore(tableId: string, options?: Partial<CreateColumnStoreOptions>) {
    if (!storeCache.has(tableId)) {
        storeCache.set(
            tableId,
            createColumnStore({
                tableId,
                ...options,
            })
        );
    }

    return storeCache.get(tableId)!;
}

/**
 * Clear store cache (useful for testing)
 */
export function clearColumnStoreCache() {
    storeCache.clear();
}
