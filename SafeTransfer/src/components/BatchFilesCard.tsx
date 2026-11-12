import {Download} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {DownloadAllButton} from "@/components/DownloadAllButton.tsx";
import {useDownloadFile} from "@/hooks/mutations/useDownloadFile.ts";
import {formatBytes} from "@/lib/formatBytes.ts";
import {getFileIcon} from "@/lib/getFileIcon.tsx";
import type {FileResponse} from "@/types/file.types.ts";

interface BatchFilesCardProps {
    files: FileResponse[];
    zipFileName: string;
}

export function BatchFilesCard({files, zipFileName}: BatchFilesCardProps) {
    const downloadFile = useDownloadFile()

    return (
        <section className="flex-1 basis-[420px] min-w-0 rounded-xl border bg-card shadow-xs">
            <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-muted">
                <h2 className="font-semibold">Files</h2>
                {files.length > 1 && <DownloadAllButton files={files} zipFileName={zipFileName}/>}
            </div>

            <ul className="px-2 py-1">
                {files.map((file) => {
                    const isDownloading = downloadFile.isPending && downloadFile.variables?.fileId === file.id

                    return (
                        <li key={file.id} className="flex items-center gap-3 p-2">
                            {getFileIcon(file.fileName, "size-4 shrink-0")}
                            <span className="flex-1 min-w-0 truncate">{file.fileName}</span>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatBytes(file.sizeBytes)}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label={`Download ${file.fileName}`}
                                disabled={isDownloading}
                                onClick={() => downloadFile.mutate({fileId: file.id, fileName: file.fileName})}
                            >
                                {isDownloading ? <Spinner/> : <Download className="size-3.5"/>}
                            </Button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
