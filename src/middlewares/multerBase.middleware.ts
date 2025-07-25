import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request } from 'express';

export interface UploadOptions {
  allowedMimeTypes?: string[];
  maxFileSize?: number; // in bytes
  storage?: StorageEngine;
}

export class BaseUploadService {
  private allowedMimeTypes: string[];
  private maxFileSize: number;
  private storage: StorageEngine;

  constructor(options: UploadOptions = {}) {
    this.allowedMimeTypes = options.allowedMimeTypes || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    this.maxFileSize = options.maxFileSize || 5 * 1024 * 1024; // 5MB default
    this.storage = options.storage || multer.memoryStorage();
  }

  private fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (this.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  };

  getMulterSingle(fieldName: string) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: this.maxFileSize },
    }).single(fieldName);
  }

  getMulterArray(fieldName: string, maxCount: number) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: this.maxFileSize },
    }).array(fieldName, maxCount);
  }

  getMulterFields(fields: { name: string; maxCount: number }[]) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: this.maxFileSize },
    }).fields(fields);
  }
}
