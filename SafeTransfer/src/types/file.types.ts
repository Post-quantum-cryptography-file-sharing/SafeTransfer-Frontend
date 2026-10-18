export interface FileResponse {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface RecipientResponse {
  id: string;
  userId: string | null;
  email: string;
  displayName: string | null;
  downloadedAt: string | null;
}

export interface BatchResponse {
  id: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  files: FileResponse[];
  recipients: RecipientResponse[];
}

export interface SharedBatchResponse {
  id: string;
  title: string;
  ownerName: string;
  ownerEmail: string;
  expiresAt: string;
  files: FileResponse[];
}

export interface UploadFilesRequest {
  files: File[];
  title: string;
  expiresAt: string;
  recipientIds: string[];
  recipientEmails: string[];
}

export interface ModifyRecipientsRequest {
  userIds: string[];
  emails: string[];
}
