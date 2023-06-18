import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from '@ticket0/common';
import { requireAuth } from '../../middlewares/require-auth';
import { currentUser } from '../../middlewares/current-user';
import { body } from 'express-validator';

import * as validUrl from 'valid-url';

import { Url } from '../../models/url-shortener';

require('dotenv').config();

const router = express.Router();

router.put(
  '/api/url/:id',
  currentUser,
  requireAuth,
  [
    body('customUrl')
      .trim()
      .notEmpty()
      .withMessage('customUrl cannot be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { customUrl } = req.body;
    const { id } = req.params;

    if (customUrl) {
      if (!validUrl.isUri(customUrl)) {
        throw new BadRequestError('CustomDomain provided is not valid');
      }
    }

    const url = await Url.findById(id);

    if (!url) {
      throw new NotFoundError();
    }

    if (url.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    url.set({
      shortUrl: `${customUrl}/${url.shortCode}`,
    });

    await url.save();

    res.status(200).send(url);
  }
);

export { router as customUrl };
