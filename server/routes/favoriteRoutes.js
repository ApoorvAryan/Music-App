import express from 'express';
import { getFavorites, toggleFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';
const router=express.Router();router.use(protect);router.get('/',getFavorites);router.post('/:songId',toggleFavorite);export default router;
