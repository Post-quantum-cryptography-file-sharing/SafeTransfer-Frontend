import {Archive, FileSpreadsheet, FileText, File, Image} from "lucide-react";
import {cn} from "cn";

export const getFileIcon = (fileName: string, className?: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'xlsx':
        case 'xls':
            return <FileSpreadsheet className={cn("text-emerald-600", className)} />;
        case 'zip':
        case 'rar':
        case '7z':
            return <Archive className={cn("text-amber-600", className)} />;
        case 'doc':
        case 'docx':
            return <FileText className={cn("text-blue-600", className)} />;
        case 'pdf':
            return <File className={cn("text-rose-600", className)} />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'svg':
        case 'bmp':
        case 'ico':
            return <Image className={cn("text-purple-600", className)} />;
        default:
            return <FileText className={cn("text-muted-foreground", className)} />;
    }
};