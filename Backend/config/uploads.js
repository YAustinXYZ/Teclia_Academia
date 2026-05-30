import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getUploadsPath = () => {
  return process.env.RENDER
    ? '/tmp/uploads'
    : path.join(__dirname, '../uploads');
};

export const getAvatarUploadsPath = () => {
  const avatarPath = path.join(getUploadsPath(), 'avatars');
  fs.mkdirSync(avatarPath, { recursive: true });
  return avatarPath;
};
