import express, { Request, Response } from 'express';

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@ticket0/common';
import { currentUser } from '../../middlewares/current-user';
import { requireAuth } from '../../middlewares/require-auth';
import { Url } from '../../models/url-shortener';
import { Analytics } from '../../models/analytics';

const router = express.Router();

router.delete(
  '/api/url/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const userLink = await Url.findById(id);

    if (!userLink) {
      throw new NotFoundError();
    }

    if (userLink.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const url = await Analytics.findOne({ url: userLink.shortUrl });

    if (!url) {
      const deleteFromUrl = await Url.deleteOne({ _id: id });
    } else {
      const deleteFromUrl = await Url.deleteOne({ _id: id });

      const deleteFromAnalytics = await Analytics.deleteMany({
        url: userLink.shortUrl,
      });
    }

    res.status(200).send({ message: 'url is deleted', success: true });
  }
);

export { router as deleteLinkRouter };
