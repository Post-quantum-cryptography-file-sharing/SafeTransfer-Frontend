import {useState} from "react";
import {Check, Trash2, UserPlus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {StyledAvatar} from "@/components/StyledAvatar.tsx";
import {RecipientSelector, type Recipient} from "@/components/RecipientSelector.tsx";
import {useAddRecipients} from "@/hooks/mutations/useAddRecipients.ts";
import {useRemoveRecipient} from "@/hooks/mutations/useRemoveRecipient.ts";
import {formatDate} from "@/lib/formatDate.ts";
import type {RecipientResponse} from "@/types/file.types.ts";

interface BatchRecipientsCardProps {
    batchId: string;
    recipients: RecipientResponse[];
}

const SHORT_DATE_TIME: Intl.DateTimeFormatOptions = {day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"}

export function BatchRecipientsCard({batchId, recipients}: BatchRecipientsCardProps) {
    const [pending, setPending] = useState<Recipient[]>([])
    const addRecipients = useAddRecipients()
    const removeRecipient = useRemoveRecipient()

    const downloadedCount = recipients.filter((r) => r.downloadedAt).length

    const newPending = pending.filter(
        (p) => !recipients.some((r) => r.email === p.email || (p.id && r.userId === p.id))
    )

    const handleAdd = () => {
        if (newPending.length === 0) return
        addRecipients.mutate(
            {
                batchId,
                data: {
                    userIds: newPending.filter((p) => p.id).map((p) => p.id!),
                    emails: newPending.filter((p) => !p.id).map((p) => p.email),
                },
            },
            {onSuccess: () => setPending([])}
        )
    }

    return (
        <section className="flex-1 basis-[420px] min-w-0 rounded-xl border bg-card shadow-xs">
            <div className="flex flex-col gap-3 px-4 pt-4 pb-3 border-b border-muted">
                <div className="flex items-baseline justify-between">
                    <h2 className="font-semibold">Recipients</h2>
                    {recipients.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            {downloadedCount} of {recipients.length} downloaded
                        </span>
                    )}
                </div>

                <div className="flex gap-2 items-start">
                    <div className="flex-1 min-w-0">
                        <RecipientSelector recipients={pending} onChange={setPending}/>
                    </div>
                    <Button
                        onClick={handleAdd}
                        disabled={newPending.length === 0 || addRecipients.isPending}
                    >
                        {addRecipients.isPending ? <Spinner/> : <UserPlus/>}
                        Add
                    </Button>
                </div>
                {addRecipients.isError && (
                    <p className="text-sm text-destructive">Couldn't add recipients. Please try again.</p>
                )}
            </div>

            {recipients.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground">
                    No one has access yet. Add someone above to share these files.
                </p>
            ) : (
                <ul className="px-2 py-1">
                    {recipients.map((r) => {
                        const name = r.displayName || r.email
                        const isRemoving = removeRecipient.isPending && removeRecipient.variables?.recipientId === r.id

                        return (
                            <li key={r.id} className="flex items-center gap-3 px-2 py-2.5">
                                <StyledAvatar name={name}/>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-medium truncate">{name}</span>
                                    <span className="text-sm text-muted-foreground truncate">
                                        {r.downloadedAt
                                            ? `Downloaded ${formatDate(r.downloadedAt, SHORT_DATE_TIME)}`
                                            : r.email}
                                    </span>
                                </div>

                                {r.downloadedAt ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-500/15 dark:text-green-400">
                                        <Check className="size-3"/>
                                        Downloaded
                                    </span>
                                ) : (
                                    <span className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                        Not downloaded
                                    </span>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Remove ${name}`}
                                    className="text-muted-foreground"
                                    disabled={isRemoving}
                                    onClick={() => removeRecipient.mutate({batchId, recipientId: r.id})}
                                >
                                    {isRemoving ? <Spinner/> : <Trash2/>}
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}
