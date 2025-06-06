/**
 * File upload helpers for the Meridian SDK.
 * Handles presigned URL uploads and progress tracking.
 * @module upload
 */

import { HttpClient } from './http';
import { MeridianError } from './errors';
import type { Attachment } from './types';

interface UploadUrl {
  uploadUrl: string;
  attachmentId: string;
}

export type UploadProgressCallback = (loaded: number, total: number) => void;

export class FileUploader {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

  constructor(private http: HttpClient) {}

  /** Upload a file and return the resulting attachment metadata. */
  async upload(file: File, onProgress?: UploadProgressCallback): Promise<Attachment> {
    if (file.size > FileUploader.MAX_FILE_SIZE) {
      throw new MeridianError(
        `File size exceeds maximum of ${FileUploader.MAX_FILE_SIZE} bytes`,
        'FILE_TOO_LARGE',
        413,
      );
    }

    const { uploadUrl, attachmentId } = await this.requestUploadUrl(file.name, file.type, file.size);
    await this.uploadToPresignedUrl(uploadUrl, file, onProgress);
    return this.confirmUpload(attachmentId);
  }

  /** Request a presigned upload URL from the Meridian API. */
  private async requestUploadUrl(filename: string, mimeType: string, size: number): Promise<UploadUrl> {
    return this.http.request<UploadUrl>({
      method: 'POST',
      path: '/uploads/presign',
      body: { filename, mimeType, size },
    });
  }

  /** Upload file data to the presigned URL using XMLHttpRequest for progress tracking. */
  private uploadToPresignedUrl(url: string, file: File, onProgress?: UploadProgressCallback): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) onProgress(event.loaded, event.total);
        };
      }

      xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new MeridianError('Upload failed', 'UPLOAD_FAILED', xhr.status)));
      xhr.onerror = () => reject(new MeridianError('Upload network error', 'UPLOAD_FAILED', null));
      xhr.send(file);
    });
  }

  /** Confirm the upload and retrieve final attachment metadata. */
  private async confirmUpload(attachmentId: string): Promise<Attachment> {
    return this.http.request<Attachment>({
      method: 'POST',
      path: `/uploads/${attachmentId}/confirm`,
    });
  }
}















































