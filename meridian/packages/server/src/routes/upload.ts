/**
 * File upload routes — handle multipart uploads for attachments and avatars.
 *
 * @module routes/upload
 */
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { FileService } from '../services/fileService';
import { loadConfig } from '../config';
import { ALLOWED_MIME_TYPES } from '../config/security';

const config = loadConfig();
const router = Router();
const fileService = new FileService();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});

router.use(authenticate);

/** POST /upload — Upload a single file */
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided' });
  }
  const record = await fileService.createRecord({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.user!.id,
  });
  res.status(201).json({ success: true, data: record });
});

/** POST /upload/bulk — Upload multiple files (max 10) */
router.post('/bulk', upload.array('files', 10), async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const records = await Promise.all(
    files.map((f) =>
      fileService.createRecord({
        filename: f.filename,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        uploadedBy: req.user!.id,
      }),
    ),
  );
  res.status(201).json({ success: true, data: records });
});

export { router as uploadRoutes };


