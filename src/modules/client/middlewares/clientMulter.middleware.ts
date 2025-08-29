import { BaseUploadService } from '@middleware-core';
import { asyncHandler, generateFileName, saveBufferedFile } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import { memoryStorage } from 'multer';
import path from 'path';

export const companyLogoPreValidator = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const uploadDir = process.env['UPLOAD_DIRECTORY'] || 'public/uploads';
    if (req.file?.buffer) {
      const fileName = generateFileName(req.file.originalname);
      const fileSystemPath = path.join(uploadDir, fileName);
      const publicPath = `/uploads/${fileName}`;

      // Expose public path for validation/DB
      req.body.companyLogo = publicPath;
      // Stash buffer and fs path for saving after validation
      (req as any)._logoBuffer = req.file.buffer;
      (req as any)._logoFsPath = fileSystemPath;
    } else {
      req.body.companyLogo = '/uploads/default.png';
      (req as any)._usingDefaultLogo = true;
    }
    next();
  }
);

const companyLogoUploadMiddleware = new BaseUploadService({
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 7 * 1024 * 1024,
  storage: memoryStorage(),
});
export const saveBufferedLogo = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const buffer = (req as any)._logoBuffer as Buffer | undefined;
    const fsPath = (req as any)._logoFsPath as string | undefined;
    if ((req as any)._usingDefaultLogo) {
      console.log('✅ Using default logo, no file to save');
      delete (req as any)._usingDefaultLogo;
      return next();
    }
    if (!buffer || !fsPath) return; // nothing to save
    await saveBufferedFile(buffer, fsPath);
    // cleanup stashed refs
    delete (req as any)._logoBuffer;
    delete (req as any)._logoFsPath;
    next();
  }
);
export const uploadClientLogo =
  companyLogoUploadMiddleware.getMulterSingle('logo');
