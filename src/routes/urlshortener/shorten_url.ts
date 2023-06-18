import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest } from '@ticket0/common';
import { requireAuth } from '../../middlewares/require-auth';
import { currentUser } from '../../middlewares/current-user';
import { body } from 'express-validator';

import * as validUrl from 'valid-url';
import * as shortid from 'shortid';

import { Url } from '../../models/url-shortener';

require('dotenv').config();

const router = express.Router();

router.post(
  '/api/url/shorten',
  currentUser,
  requireAuth,
  [
    body('longUrl').trim().notEmpty().withMessage('LongUrl cannot be empty'),

    body('customUrl').trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { longUrl, customUrl } = req.body;

    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL must be defined');
    }

    const baseUrl = process.env.BASE_URL!;

    //check that the base usrl is valid
    if (!validUrl.isUri(baseUrl)) {
      throw new BadRequestError('Not a valid base url');
    }

    //check that the long url is valid
    if (!validUrl.isUri(longUrl)) {
      throw new BadRequestError('Url provided is not valid');
    }

    if (customUrl) {
      if (!validUrl.isUri(customUrl)) {
        throw new BadRequestError('CustomDomain provided is not valid');
      }
    }

    // Generate url shortCode
    let shortCode = shortid.generate();

    let url = await Url.findOne({ longUrl });

    if (url) {
      res.status(200).send(url);
    } else {
      const shortUrl = `${customUrl || baseUrl}/${shortCode}`;

      const url = Url.build({
        shortCode,
        longUrl,
        shortUrl,
        userId: req.currentUser!.id,
      });

      await url.save();

      res.status(201).send(url);
    }
  }
);

export { router as shortenUrl };
