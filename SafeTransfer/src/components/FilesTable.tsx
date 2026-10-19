import {useState} from "react"
import {flexRender} from "@tanstack/react-table"
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useLegacyTable,
    type LegacyColumnDef,
} from "@tanstack/react-table/legacy"
import {useNavigate} from "react-router-dom"
import {ChevronRight, Folder, Upload} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Skeleton} from "@/components/ui/skeleton"
import {useMyBatches} from "@/hooks/queries/useMyBatches"
import {formatBytes} from "@/lib/formatBytes"
import type {BatchResponse} from "@/types/file.types"
import {AvatarGroup} from "@/components/ui/avatar.tsx";
import {StyledAvatar} from "@/components/StyledAvatar.tsx";
import {useUploadDialog} from "@/contexts/UploadDialogContext";
import {ExpiresAtBadge} from "@/components/ExpiresAtBadge.tsx";

function ManageButton({batchId}: { batchId: string }) {
    const navigate = useNavigate()
    return (
        <Button
            className="bg-white border border-input"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/batch/${batchId}`)}
        >
            <div className="flex flex-row items-center gap-2">
                <p>Manage</p>
                <ChevronRight/>
            </div>
        </Button>
    )
}

function EmptyState() {
    const {open} = useUploadDialog()
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                <Folder className="size-8 text-muted-foreground"/>
            </div>
            <h3 className="text-lg font-medium mb-1">No files uploaded yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Upload your first batch of files to securely share them with others.
            </p>
            <Button onClick={open}>
                <Upload className="size-4"/>
                Upload files
            </Button>
        </div>
    )
}

const columns: LegacyColumnDef<BatchResponse>[] = [
    {
        accessorKey: "title",
        header: "Batch",
        cell: ({row}) => {
            const files = row.original.files
            const totalSize = files.reduce((sum, f) => sum + f.sizeBytes, 0)
            return (
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                        <Folder className="size-4 text-primary"/>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium">{row.getValue("title")}</p>
                        <p className="text-xs text-muted-foreground">
                            {files.length} {files.length === 1 ? "file" : "files"} · {formatBytes(totalSize)}
                        </p>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Uploaded",
        cell: ({row}) => {
            const date = new Date(row.getValue("createdAt"))
            return date.toLocaleDateString("en-GB", {day: "numeric", month: "short"})
        },
    },
    {
        accessorKey: "expiresAt",
        header: "Expires",
        cell: ({row}) => {
            return <ExpiresAtBadge expiresAtString={row.getValue("expiresAt")} />
        },
    },
    {
        accessorKey: "recipients",
        header: "Recipients",
        size: 180,
        cell: ({row}) => {
            const recipients = row.original.recipients
            if (recipients.length === 0) return "—"
            if (recipients.length === 1)
                return (
                    <div className="flex flex-row items-center gap-3 text-muted-foreground">
                        <StyledAvatar key={recipients[0].id} name={recipients[0].displayName!} size="sm"/>
                        {recipients[0].downloadedAt !== null ?
                            <p>Has downloaded</p> : <p> Not downloaded yet </p>
                        }
                    </div>
                )
            const downloadedCount = recipients.filter(r => r.downloadedAt !== null).length
            return (
                <div className="flex flex-row items-center gap-3 text-muted-foreground">
                    <AvatarGroup>
                        {recipients.map((recipient) => (
                            <StyledAvatar key={recipient.id} name={recipient.displayName!} size="sm"/>
                        ))}
                    </AvatarGroup>
                    <p>{downloadedCount} of {recipients.length} downloaded</p>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "",
        meta: {
            className: "text-right",
        },
        cell: ({row}) => (
            <div className="flex justify-end">
                <ManageButton batchId={row.original.id}/>
            </div>
        ),
    },
]

export function FilesTable() {
    const {data: batches, isLoading} = useMyBatches()
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useLegacyTable({
        data: batches ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 7,
                pageIndex: 0
            },
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-9 w-64"/>
                <Table containerClassName="bg-card border border-border">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead>Recipients</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-32"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-20"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-20"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                <TableCell><Skeleton className="h-8 w-16"/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (!batches || batches.length === 0) {
        return <EmptyState/>
    }

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search batches..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm bg-white"
            />

            <Table containerClassName="bg-card border border-border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    style={{width: header.getSize() !== 150 ? header.getSize() : undefined}}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount() || 1}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
