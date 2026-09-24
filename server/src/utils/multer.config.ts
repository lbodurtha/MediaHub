import multer, { type StorageEngine, type FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@mediahub/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');
const uploadsPath = path.join(projectRoot, 'uploads');

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    cb(null, uploadsPath);
  },
  filename: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname);
    const safeExt = rawExt.replace(/[^a-zA-Z0-9.]/g, '');
    const filename = `${file.fieldname}-${uuidv4()}${safeExt}`;
    cb(null, filename);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if ((ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only MP4, WebM, OGG, AVI, and MOV videos are allowed.`,
      ),
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
