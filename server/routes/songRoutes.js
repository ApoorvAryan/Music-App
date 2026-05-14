import express from 'express';
import {
  deleteSong,
  getSongs,
  playSong,
  uploadSong
} from '../controllers/songController.js';

import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getSongs);

router.post(
  '/',
  protect,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  uploadSong
);

router.post('/:id/play', protect, playSong);

router.delete('/:id', protect, deleteSong);

export default router;