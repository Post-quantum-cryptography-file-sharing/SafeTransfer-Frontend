import {formatDate} from "@/lib/formatDate.ts";
import {formatBytes} from "@/lib/formatBytes.ts";
import {ExpiresAtBadge} from "@/components/ExpiresAtBadge.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import type {BatchResponse} from "@/types/file.types.ts";

interface BatchHeaderProps {
    batch: BatchResponse;
}

export function BatchHeader({batch}: BatchHeaderProps) {
    const fileCount = batch.files.length
    const totalBytes = batch.files.reduce((sum, f) => sum + f.sizeBytes, 0)

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight break-words">{batch.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div>
                    Uploaded {formatDate(batch.createdAt, {day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"})}
                </div>
                <div>
                    {fileCount} {fileCount === 1 ? "file" : "files"} · {formatBytes(totalBytes)}
                </div>
                <ExpiresAtBadge expiresAtString={batch.expiresAt}/>
            </div>
        </div>
    )
}

export function BatchHeaderSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64"/>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Skeleton className="h-5 w-44"/>
                <Skeleton className="h-5 w-24"/>
                <Skeleton className="h-6 w-20"/>
            </div>
        </div>
    )
}
