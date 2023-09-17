export class OperationFile {
  originalname: string;
  buffer: Buffer;

  constructor(originalname: string, buffer: Buffer);
  constructor(file: Express.Multer.File);
  constructor(fileOrName: Express.Multer.File | string, buffer?: Buffer) {
    if (typeof fileOrName === 'string') {
      this.originalname = fileOrName;
      this.buffer = buffer;
    } else {
      this.originalname = fileOrName.originalname;
      this.buffer = fileOrName.buffer;
    }
  }
}
