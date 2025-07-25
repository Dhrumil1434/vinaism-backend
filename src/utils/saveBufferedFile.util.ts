import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Saves a buffer to the specified file path, creating directories as needed.
 * @param buffer The file buffer to save.
 * @param destinationPath The absolute or relative path where the file should be saved.
 * @returns The path where the file was saved.
 */
export async function saveBufferedFile(
  buffer: Buffer,
  destinationPath: string
): Promise<string> {
  const dir = path.dirname(destinationPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(destinationPath, buffer);
  return destinationPath;
}
export function generateFileName(fileNameOriginal: string): string {
  const fileName = `${Date.now()}_${fileNameOriginal.replace(/\s+/g, '_')}`;
  return fileName;
}
