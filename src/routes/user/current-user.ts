import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../../middlewares/current-user';
import { Url } from '../../models/url-shortener';
import { Analytics } from '../../models/analytics';
import { getClient } from '../../../services/cache';

const router = express.Router();

interface User {
  user: {
    id: string;
    email: string;
  };
  totalUrls: number;
  totalClicks: number;
}

router.get(
  '/api/users/currentuser',
  currentUser,
  async (req: Request, res: Response) => {
    if (req.currentUser) {
      const userId = req.currentUser?.id;

      const userLinksCount = await Url.countDocuments({ userId });

      const analyticsCount = await Analytics.countDocuments({ userId });

      const currentUser: User = {
        user: req.currentUser,
        totalUrls: userLinksCount,
        totalClicks: analyticsCount,
      };

      res.send({ currentUser });
    } else {
      res.status(204).send({ currentUser: req.currentUser || null });
    }
  }
);

export { router as currentUserRouter };
