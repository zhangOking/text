import express from 'express';
const router = express.Router();
import { downloadController } from '../controllers/downloadController.js';

router.get('/:filename', downloadController);

export default router
