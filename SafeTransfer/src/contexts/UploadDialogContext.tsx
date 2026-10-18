import { createContext, useContext } from 'react';
import { useUploadDialogState, type UseUploadDialogStateReturn } from '@/hooks/useUploadDialogState';

const UploadDialogContext = createContext<UseUploadDialogStateReturn | null>(null);

export function UploadDialogProvider({ children }: { children: React.ReactNode }) {
    const dialogState = useUploadDialogState(false);

    return (
        <UploadDialogContext.Provider value={dialogState}>
            {children}
        </UploadDialogContext.Provider>
    );
}

export function useUploadDialog() {
    const context = useContext(UploadDialogContext);
    if (!context) {
        throw new Error('useUploadDialog must be used within an UploadDialogProvider');
    }
    return context;
}
