import fs from 'fs/promises';
import path from 'path';

type ModeOptions = { mode: number } | number;

function checkPath(pth: string) {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(
      pth.replace(path.parse(pth).root, ''),
    );

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      error.message = 'EINVAL';
      throw error;
    }
  }
}

const getMode = (options: ModeOptions = { mode: 0o777 }) => {
  if (typeof options === 'number') return options;
  return options.mode;
};

export async function ensureDir(dir: string, options?: ModeOptions) {
  checkPath(dir);

  return fs.mkdir(dir, {
    mode: getMode(options),
    recursive: true,
  });
}
