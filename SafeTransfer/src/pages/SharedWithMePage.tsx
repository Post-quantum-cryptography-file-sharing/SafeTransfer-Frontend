import {useState} from "react";
import {Download, Inbox} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {DownloadAllButton} from "@/components/DownloadAllButton.tsx";
import {useSharedBatches} from "@/hooks/queries/useSharedBatches.ts";
import {StyledAvatar} from "@/components/StyledAvatar.tsx";
import {formatBytes} from "@/lib/formatBytes.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {ExpiresAtBadge} from "@/components/ExpiresAtBadge.tsx";
import {getFileIcon} from "@/lib/getFileIcon.tsx";
import {fileApi} from "@/api/file.api.ts";
import {Spinner} from "@/components/ui/spinner.tsx";

function DownloadButton({fileId, fileName, disabled}: {fileId: string; fileName: string; disabled?: boolean}) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const blob = await fileApi.downloadFile(fileId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading || disabled}
        >
            {isDownloading ? (
                <Spinner />
            ) : (
                <div className="flex flex-row gap-2 items-center">
                    <Download className="size-4" />
                    Download
                </div>
            )}
        </Button>
    );
}

function SkeletonCard() {
    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="sm:ms-auto">
                    <Skeleton className="h-6 w-20" />
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-3">
                {Array.from({length: 2}).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="size-5 shrink-0" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-16 shrink-0" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                <Inbox className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No files shared with you</h3>
            <p className="text-muted-foreground max-w-sm">
                When someone shares files with you, they'll appear here.
            </p>
        </div>
    );
}

export function SharedWithMePage() {
    const {data: batches, isLoading, isError} = useSharedBatches();

    if (isError) {
        return <p>Error loading the batches</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Shared with me</h1>
                <p className="text-muted-foreground">
                    Files other people sent you. Download them before they expire.
                </p>
            </div>

            {isLoading && (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            )}

            {!isLoading && batches?.length === 0 && <EmptyState />}

            {batches?.map((batch) => {
                const isExpired = new Date(batch.expiresAt).getTime() < Date.now();
                return (
                <Card key={batch.id}>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <StyledAvatar name={batch.ownerName} size="lg" />
                            <div className="flex flex-col">
                                <div className="font-bold">
                                    {batch.title}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    From {batch.ownerName} · {batch.files.length} {batch.files.length === 1 ? "file" : "files"} · {formatBytes(batch.files.reduce((sum, f) => sum + f.sizeBytes, 0))}
                                </div>
                            </div>
                        </div>
                        <div className="sm:ms-auto flex items-center gap-3">
                            <ExpiresAtBadge expiresAtString={batch.expiresAt} />
                            <DownloadAllButton files={batch.files} zipFileName={batch.title} disabled={isExpired} />
                        </div>
                    </CardHeader>
                    <Separator/>
                    <CardContent className="flex flex-col gap-3">
                        {batch.files.map(file => (
                            <div key={file.id} className="flex items-center gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {getFileIcon(file.fileName, "size-5 shrink-0")}
                                    <span className="truncate">{file.fileName}</span>
                                </div>
                                <p className="text-muted-foreground text-sm shrink-0">{formatBytes(file.sizeBytes)}</p>
                                <DownloadButton fileId={file.id} fileName={file.fileName} disabled={isExpired} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            );
            })}

        </div>
    )
}