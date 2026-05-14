import express from 'express';
import { deleteUser, listUsers, profile, stats } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/auth.js';
const router=express.Router();router.get('/profile',protect,profile);router.get('/stats',protect,adminOnly,stats);router.get('/',protect,adminOnly,listUsers);router.delete('/:id',protect,adminOnly,deleteUser);export default router;
