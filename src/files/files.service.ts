import { FileElementResponse } from './dto/file-element.response';
import { Injectable } from '@nestjs/common';
import { OperationFile } from './dto/operation-file.class';
import { ensureDir } from './lib/ensureDir';
import { path } from 'app-root-path';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

@Injectable()
export class FilesService {
  async saveFiles(files: OperationFile[]): Promise<FileElementResponse[]> {
    const dateFolderName = new Date()
      .toLocaleString('ru')
      .split(', ')[0]
      .replace(/\./g, '-');
    const uploadFolder = `${path}/uploads/${dateFolderName}`;
    await ensureDir(uploadFolder);
    const response: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      response.push({
        name: file.originalname,
        url: `${dateFolderName}/${file.originalname}`,
      });
    }

    return response;
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
