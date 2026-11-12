import {Skeleton} from "@/components/ui/skeleton.tsx";
import {BatchHeaderSkeleton} from "@/components/BatchHeader.tsx";

function CardSkeleton({rows, withAvatar = false}: { rows: number; withAvatar?: boolean }) {
    return (
        <section className="flex-1 basis-[420px] min-w-0 rounded-xl border bg-card shadow-xs">
            <div className="px-4 pt-4 pb-3 border-b border-muted">
                <Skeleton className="h-5 w-24"/>
            </div>
            <ul className="px-2 py-1">
                {Array.from({length: rows}).map((_, i) => (
                    <li key={i} className="flex items-center gap-3 p-2">
                        {withAvatar
                            ? <Skeleton className="size-8 rounded-full"/>
                            : <Skeleton className="size-4"/>}
                        <Skeleton className="h-4 flex-1"/>
                        <Skeleton className="size-8"/>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export function BatchDetailsSkeleton() {
    return (
        <div className="space-y-8" aria-busy="true" aria-label="Loading batch">
            <BatchHeaderSkeleton/>
            <div className="flex flex-wrap items-start gap-6">
                <CardSkeleton rows={3}/>
                <CardSkeleton rows={2} withAvatar/>
            </div>
        </div>
    )
}
