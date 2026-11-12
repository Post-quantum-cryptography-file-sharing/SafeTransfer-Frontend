import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { UploadDialog } from './UploadDialog';
import { UploadDialogProvider, useUploadDialog } from '@/contexts/UploadDialogContext';

function DashboardContent() {
    const { isOpen, close } = useUploadDialog();

    return (
        <div className="min-h-dvh bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <UploadDialog isOpen={isOpen} onClose={close} />
        </div>
    );
}

export function DashboardLayout() {
    return (
        <UploadDialogProvider>
            <DashboardContent />
        </UploadDialogProvider>
    );
}
