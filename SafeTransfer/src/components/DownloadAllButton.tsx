import {useState} from "react";
import JSZip from "jszip";
import {Archive} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {fileApi} from "@/api/file.api.ts";
import {Spinner} from "@/components/ui/spinner.tsx";

interface FileToDownload {
    id: string;
    fileName: string;
}

interface DownloadAllButtonProps {
    files: FileToDownload[];
    zipFileName: string;
    disabled?: boolean;
}

export function DownloadAllButton({files, zipFileName, disabled}: DownloadAllButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        setProgress(0);

        try {
            const zip = new JSZip();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const blob = await fileApi.downloadFile(file.id);
                zip.file(file.fileName, blob);
                setProgress(Math.round(((i + 1) / files.length) * 100));
            }

            const zipBlob = await zip.generateAsync({type: "blob"});
            const url = window.URL.createObjectURL(zipBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${zipFileName}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
            setProgress(0);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            disabled={isDownloading || disabled}
        >
            {isDownloading ? (
                <div className="flex flex-row gap-2 items-center">
                    <Spinner />
                    {progress}%
                </div>
            ) : (
                <div className="flex flex-row gap-2 items-center">
                    <Archive className="size-4" />
                    Download all
                </div>
            )}
        </Button>
    );
}
