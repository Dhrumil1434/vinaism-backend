import { BaseUploadService } from '@middleware-core';
import { asyncHandler } from '@utils-core';
import { NextFunction, Request, Response } from 'express';

export const profilePicturePreValidator = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.file) {
      // Generate a unique file name (timestamp + original name, spaces replaced)
      const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
      // The static path you will serve (e.g., /uploads/...)
      const staticPath = `/uploads/${fileName}`;

      // Bind the path to req.body for validation and DB storage
      req.body.profilePicture = staticPath;
      // Optionally, attach the fileName for use in the controller
    }
    next();
  }
);

const profilePictureUploadMiddleware = new BaseUploadService({
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 7 * 1024 * 1024,
});
export const uploadProfilePicture =
  profilePictureUploadMiddleware.getMulterSingle('profilePicture');
