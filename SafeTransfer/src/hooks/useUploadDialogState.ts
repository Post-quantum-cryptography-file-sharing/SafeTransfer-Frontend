import { useState } from 'react';

export interface UseUploadDialogStateReturn {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export function useUploadDialogState(initialState: boolean = false): UseUploadDialogStateReturn {
    const [isOpen, setIsOpen] = useState<boolean>(initialState);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    return {
        isOpen,
        setIsOpen,
        open,
        close,
        toggle,
    };
}
