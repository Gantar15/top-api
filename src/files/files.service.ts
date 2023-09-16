import { stat, writeFile } from 'fs/promises';

import { FileElementResponse } from './dto/file-element.response';
import { Injectable } from '@nestjs/common';
import { ensureDir } from './lib/ensureDir';
import { path } from 'app-root-path';

@Injectable()
export class FilesService {
  async saveFiles(
    files: Express.Multer.File[],
  ): Promise<FileElementResponse[]> {
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
}
