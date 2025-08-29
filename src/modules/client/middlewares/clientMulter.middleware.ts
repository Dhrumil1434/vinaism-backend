import { BaseUploadService } from '@middleware-core';
import { asyncHandler, generateFileName, saveBufferedFile } from '@utils-core';
import { NextFunction, Request, Response } from 'express';
import path from 'path';

export const companyLogoPreValidator = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const uploadDir = process.env['UPLOAD_DIRECTORY'] || 'public/uploads';
    if (req.file && req.file?.buffer) {
      // Generate a unique file name (timestamp + original name, spaces replaced)
      const fileName = generateFileName(req.file.originalname);
      // The static path you will serve (e.g., /uploads/...)
      const filePath = path.join(uploadDir, fileName);

      await saveBufferedFile(req.file.buffer, filePath);

      // Bind the path to req.body for validation and DB storage
      req.body.companyLogo = filePath;
      // Optionally, attach the fileName for use in the controller
    } else {
      req.body.companyLogo = '/uploads/default.png';
    }
    next();
  }
);

const companyLogoUploadMiddleware = new BaseUploadService({
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 7 * 1024 * 1024,
});
export const uploadClientLogo =
  companyLogoUploadMiddleware.getMulterSingle('logo');
