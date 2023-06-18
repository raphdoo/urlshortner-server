import express, { Request, Response } from 'express';

import { Analytics } from '../../models/analytics';
import { Url } from '../../models/url-shortener';

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@ticket0/common';

import { currentUser } from '../../middlewares/current-user';
import { requireAuth } from '../../middlewares/require-auth';
import { cacheData, client } from '../../../services/cache';

interface tracked_analytics {
  user_analytics: {};
}

const router = express.Router();

router.get(
  '/api/analytics',
  currentUser,
  requireAuth,
  cacheData,
  async (req: Request, res: Response) => {
    const userId = req.currentUser?.id;
    const endpoint = '/api/analytics';

    const analytics = await Analytics.find({ userId }).sort({ date: -1 });

    await client.set(endpoint, JSON.stringify(analytics), {
      EX: 180,
      NX: true,
    });

    res.send(analytics);
  }
);

export { router as AnalyticsRouter };
