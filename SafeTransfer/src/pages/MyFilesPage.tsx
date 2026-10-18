import {FilesTable} from "@/components/FilesTable";

export function MyFilesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Files</h1>
                <p className="text-muted-foreground">
                    Batches you uploaded. Only you and the recipients of your choice can view them.
                </p>
            </div>
            <FilesTable />
        </div>
    );
}