import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {FileUploader} from "@/components/FileUploader.tsx";

interface UploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadDialog({isOpen, onClose}: UploadDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                        Files are encrypted before they are stored. Only you and your recipients can open them.
                    </DialogDescription>
                </DialogHeader>
                <FileUploader onSuccess={onClose}/>
            </DialogContent>
        </Dialog>
    );
}
