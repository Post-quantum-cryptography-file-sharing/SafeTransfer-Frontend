import {Clock} from "lucide-react";
import {formatRelativeTime} from "@/lib/expiration.ts";

interface ExpiresAtBadgeProps {
    expiresAtString: string;
}

export function ExpiresAtBadge({expiresAtString}: ExpiresAtBadgeProps) {
    const expiresAt = new Date(expiresAtString)
    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    const isExpired = diffMs < 0
    const isExpiringSoon = diffMs > 0 && diffMs < 24 * 60 * 60 * 1000

    if (isExpired) {
        return (
            <div
                className="flex items-center gap-2 border border-destructive/50 bg-destructive/10 text-destructive w-min whitespace-nowrap px-2 py-0.5 rounded-sm text-sm">
                <Clock className="size-3"/>
                Expired
            </div>
        )
    }

    if (isExpiringSoon) {
        return (
            <div
                className="flex items-center gap-2 border border-amber-500/50 bg-amber-500/10 text-amber-900 w-min whitespace-nowrap px-2 py-0.5 rounded-sm text-sm">
                <Clock className="size-3"/>
                in {formatRelativeTime(expiresAt)}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 border border-input w-min whitespace-nowrap px-2 py-0.5 rounded-sm text-sm">
            <Clock className="size-3"/>
            in {formatRelativeTime(expiresAt)}
        </div>
    )
}