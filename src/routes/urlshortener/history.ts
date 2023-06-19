import express, { Request, Response } from 'express';

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@ticket0/common';
import { currentUser } from '../../middlewares/current-user';
import { requireAuth } from '../../middlewares/require-auth';
import { Url } from '../../models/url-shortener';
import { cacheData, client } from '../../../services/cache';

const router = express.Router();

router.get(
  '/api/history',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser?.id;
    const page = parseInt(JSON.stringify(req.query.page)) || 1;
    const limit = parseInt(JSON.stringify(req.query.limit)) || 10;

    const endpoint = '/api/history';

    const userLinks = await Url.find({ userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.send(userLinks);
  }
);

export { router as historyRouter };
