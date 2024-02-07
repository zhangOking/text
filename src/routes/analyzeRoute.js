import express from 'express';
const router = express.Router();
import { analyze } from '../controllers/analyzeController.js';

router.post('/', analyze);

export default router
