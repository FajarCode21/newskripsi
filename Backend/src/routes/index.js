import express from 'express';

import authenticationRoute from './authenticationRoute.js';
import userRoute from './userRoute.js';
import machineRoute from './machineRoute.js';
import predictRoute from './predictRoute.js';

const router = express.Router();

router.use('/api/auth', authenticationRoute);
router.use('/api/users', userRoute);
router.use('/api/machines', machineRoute);
router.use('/api/predict', predictRoute);

export default router;
