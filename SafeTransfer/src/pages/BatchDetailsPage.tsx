import {useParams} from "react-router-dom";
import {useBatch} from "@/hooks/queries/useBatch.ts";
import {BackLink} from "@/components/BackLink.tsx";
import {BatchHeader} from "@/components/BatchHeader.tsx";
import {BatchDetailsSkeleton} from "@/components/BatchDetailsSkeleton.tsx";
import {BatchFilesCard} from "@/components/BatchFilesCard.tsx";
import {BatchRecipientsCard} from "@/components/BatchRecipientsCard.tsx";

export function BatchDetailsPage() {
    const params = useParams()
    const {data: batch, isLoading} = useBatch(params.id!)

    return (
        <div className="space-y-8">
            <BackLink to="/files" label="My files"/>

            {isLoading ? (
                <BatchDetailsSkeleton/>
            ) : (
                <>
                    <BatchHeader batch={batch!}/>

                    <div className="flex flex-wrap items-start gap-6">
                        <BatchFilesCard files={batch!.files} zipFileName={batch!.title}/>
                        <BatchRecipientsCard batchId={batch!.id} recipients={batch!.recipients}/>
                    </div>
                </>
            )}
        </div>
    )
}
