import express from 'express'
const router = express.Router();
import { register, signin } from '../controllers/company.controllers.js';

router.post('/register',register);
router.get('/signin/:cid',signin);

export default router;