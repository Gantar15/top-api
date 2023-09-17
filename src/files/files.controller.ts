import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { OperationFile } from './dto/operation-file.class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    let convertedFiles: OperationFile[] = [file];
    if (file.mimetype.includes('image')) {
      const webpFileBuffer = await this.filesService.convertToWebP(file.buffer);
      const newFileName = file.originalname.split('.')[0] + '.webp';
      convertedFiles.push(new OperationFile(newFileName, webpFileBuffer));
    }
    return this.filesService.saveFiles(convertedFiles);
  }
}
