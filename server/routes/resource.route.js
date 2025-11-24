import express from 'express';
import { getNearbyResources, getMapConfig } from '../controllers/resource.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.get('/nearby', protect, getNearbyResources);
router.get('/map-config', protect, getMapConfig);

export default router;