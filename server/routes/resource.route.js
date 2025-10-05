import express from 'express';
import { getNearbyResources } from '../controllers/resource.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.get('/nearby', protect, getNearbyResources); 

export default router;