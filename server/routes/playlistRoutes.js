import express from 'express';
import { addSong, createPlaylist, deletePlaylist, getPlaylists, removeSong, updatePlaylist } from '../controllers/playlistController.js';
import { protect } from '../middleware/auth.js';
const router=express.Router();router.use(protect);router.route('/').get(getPlaylists).post(createPlaylist);router.route('/:id').put(updatePlaylist).delete(deletePlaylist);router.post('/:id/songs',addSong);router.delete('/:id/songs/:songId',removeSong);export default router;
