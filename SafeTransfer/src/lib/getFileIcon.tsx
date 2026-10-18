import {Archive, FileSpreadsheet, FileText, File} from "lucide-react";

export const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'xlsx':
        case 'xls':
            return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
        case 'zip':
            return <Archive className="h-4 w-4 text-amber-600" />;
        case 'doc':
        case 'docx':
            return <FileText className="h-4 w-4 text-blue-600" />;
        case 'pdf':
            return <File className="h-4 w-4 text-rose-600" />;
        default:
            return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
};