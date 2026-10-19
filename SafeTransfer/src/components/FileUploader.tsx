import {useCallback, useState, useEffect} from "react";
import {useDropzone} from "react-dropzone";
import {useQueryClient} from "@tanstack/react-query";
import {UploadCloud, X, Check} from "lucide-react";
import {
    Attachment, AttachmentAction, AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle
} from "@/components/ui/attachment.tsx";
import {getFileIcon} from "@/lib/getFileIcon.tsx";
import {formatBytes} from "@/lib/formatBytes.ts";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Button} from "@/components/ui/button.tsx";
import {fileApi} from "@/api/file.api.ts";
import {queryKeys} from "@/hooks/queryKeys.ts";
import {getExpirationDate, formatExpirationDate, getExpirationISO} from "@/lib/expiration.ts";
import {RecipientSelector, type Recipient} from "@/components/RecipientSelector.tsx";
import {cn} from "cn";

interface FileUploaderProps {
    onSuccess?: () => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export function FileUploader({onSuccess}: FileUploaderProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [title, setTitle] = useState("");
    const [expirationDays, setExpirationDays] = useState("7");
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (uploadState === "success") {
            const timer = setTimeout(() => {
                setSelectedFiles([]);
                setTitle("");
                setExpirationDays("7");
                setRecipients([]);
                setUploadState("idle");
                setUploadProgress(0);
                onSuccess?.();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [uploadState, onSuccess]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "text/plain": [".txt"],
            "application/zip": [".zip"],
            "application/x-zip-compressed": [".zip"],
            "application/x-compressed": [".zip"],
            "application/x-rar-compressed": [".rar"],
            "application/x-7z-compressed": [".7z"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/webp": [".webp"],
            "image/svg+xml": [".svg"],
            "image/bmp": [".bmp"],
            "image/x-icon": [".ico"],
        },
        multiple: true,
    });

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        const recipientIds = recipients.filter((r) => r.id).map((r) => r.id!);
        const recipientEmails = recipients.filter((r) => r.isTemporary).map((r) => r.email);

        setUploadState("uploading");
        setUploadProgress(0);

        try {
            await fileApi.uploadFiles({
                data: {
                    files: selectedFiles,
                    title: title || "Untitled",
                    expiresAt: getExpirationISO(parseInt(expirationDays)),
                    recipientIds,
                    recipientEmails,
                },
                onProgress: setUploadProgress,
            });
            await queryClient.invalidateQueries({queryKey: queryKeys.myBatches});
            setUploadState("success");
        } catch {
            setUploadState("error");
            setUploadProgress(0);
        }
    };

    const expirationDate = getExpirationDate(parseInt(expirationDays));
    const isUploading = uploadState === "uploading";
    const isSuccess = uploadState === "success";
    const isError = uploadState === "error";

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-3 sm:p-5 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                    <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground"/>
                    <p className="text-sm font-medium">
                        {isDragActive ? "Drop documents here..." : "Drop files here, or click to browse"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Supports PDFs, Word, Excel, images and archives
                    </p>
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-32 sm:max-h-56 overflow-y-auto pr-1">
                    {selectedFiles.map((file, idx) => (
                        <Attachment key={`${file.name}-${idx}`} state="done" size="sm" className="w-full">
                            <AttachmentMedia>
                                {getFileIcon(file.name)}
                            </AttachmentMedia>

                            <AttachmentContent>
                                <AttachmentTitle className="truncate">{file.name}</AttachmentTitle>
                                <AttachmentDescription>
                                    {formatBytes(file.size)}
                                </AttachmentDescription>
                            </AttachmentContent>

                            <AttachmentActions>
                                <AttachmentAction
                                    onClick={() => removeFile(idx)}
                                    aria-label={`Remove ${file.name}`}
                                    size="icon"
                                    variant="ghost"
                                    disabled={isUploading}
                                >
                                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                                </AttachmentAction>
                            </AttachmentActions>
                        </Attachment>
                    ))}
                </div>
            )}

            <FieldGroup>
                <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                        placeholder="Holiday photos"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isUploading}
                    />
                </Field>

                <Field>
                    <FieldLabel>Expires after</FieldLabel>
                    <Tabs value={expirationDays} onValueChange={setExpirationDays}>
                        <TabsList className="w-full">
                            <TabsTrigger value="1" disabled={isUploading}>1 day</TabsTrigger>
                            <TabsTrigger value="3" disabled={isUploading}>3 days</TabsTrigger>
                            <TabsTrigger value="7" disabled={isUploading}>7 days</TabsTrigger>
                            <TabsTrigger value="30" disabled={isUploading}>30 days</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <FieldDescription>
                        Files are deleted on {formatExpirationDate(expirationDate)}
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel>Recipients</FieldLabel>
                    <RecipientSelector
                        recipients={recipients}
                        onChange={setRecipients}
                    />
                </Field>
            </FieldGroup>

            {isError && (
                <p className="text-sm text-destructive">
                    Upload failed. Please try again.
                </p>
            )}

            <Button
                className={cn(
                    "w-full relative overflow-hidden",
                    isSuccess && "bg-green-600 hover:bg-green-600 disabled:opacity-100"
                )}
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading || title.length === 0 || isSuccess}
            >
                {isUploading && (
                    <div
                        className="absolute inset-0 bg-primary/30 transition-all duration-300"
                        style={{width: `${uploadProgress}%`}}
                    />
                )}
                <span className="relative z-10">
                    {isUploading ? (
                        `Uploading... ${uploadProgress}%`
                    ) : isSuccess ? (
                        <span className="flex items-center gap-2">
                            <Check className="size-4"/>
                            Upload successful
                        </span>
                    ) : (
                        "Upload"
                    )}
                </span>
            </Button>
        </div>
    );
}
