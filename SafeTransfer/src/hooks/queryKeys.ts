export const queryKeys = {
  currentUser: ['currentUser'] as const,

  myBatches: ['batches', 'my'] as const,
  sharedBatches: ['batches', 'shared'] as const,
  batch: (id: string) => ['batches', id] as const,

  userSearch: (query: string) => ['users', 'search', query] as const,
} as const;
