/**
 * File service — handles file metadata persistence and storage operations.
 *
 * @module services/fileService
 */
import path from 'path';
import fs from 'fs/promises';
import { getDataSource } from '../db';
import { File } from '../models/File';
import { NotFoundError } from '../middleware/errorHandler';
import { loadConfig } from '../config';
import { generateId } from '../utils/id';

interface CreateFileInput {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
}

export class FileService {
  /** Create a file record in the database after successful upload */
  async createRecord(input: CreateFileInput): Promise<File> {
    const repo = getDataSource().getRepository(File);
    const file = repo.create({
      id: generateId(),
      filename: input.filename,
      originalName: input.originalName,
      mimeType: input.mimeType,
      size: input.size,
      uploadedBy: input.uploadedBy,
      url: `/uploads/${input.filename}`,
    });
    return repo.save(file);
  }

  /** Get a file record by ID */
  async getFileById(fileId: string): Promise<File> {
    const repo = getDataSource().getRepository(File);
    const file = await repo.findOneBy({ id: fileId });
    if (!file) throw new NotFoundError('File');
    return file;
  }

  /** Delete a file from storage and the database */
  async deleteFile(fileId: string, userId: string): Promise<void> {
    const repo = getDataSource().getRepository(File);
    const file = await repo.findOneBy({ id: fileId });
    if (!file) throw new NotFoundError('File');

    const config = loadConfig();
    const filePath = path.join(config.uploadDir, file.filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`[FileService] Could not delete physical file: ${filePath}`);
    }

    await repo.delete(fileId);
  }

  /** List files uploaded by a specific user */
  async getFilesByUser(userId: string): Promise<File[]> {
    const repo = getDataSource().getRepository(File);
    return repo.find({
      where: { uploadedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  /** Calculate total storage used by a user in bytes */
  async getUserStorageUsage(userId: string): Promise<number> {
    const ds = getDataSource();
    const result = await ds
      .getRepository(File)
      .createQueryBuilder('file')
      .select('COALESCE(SUM(file.size), 0)', 'totalSize')
      .where('file.uploadedBy = :userId', { userId })
      .getRawOne();
    return parseInt(result?.totalSize || '0', 10);
  }
}




