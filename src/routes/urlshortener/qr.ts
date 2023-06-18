import express, { Request, Response } from 'express';
import qrcode from 'qrcode';
import * as validUrl from 'valid-url';

import { Url } from '../../models/url-shortener';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@ticket0/common';
import { currentUser } from '../../middlewares/current-user';
import { requireAuth } from '../../middlewares/require-auth';

const router = express.Router();

router.put(
  '/api/qr/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    let id = req.params.id;

    const url = await Url.findOne({ _id: id });

    if (!url) {
      throw new NotFoundError();
    }

    let qrCode;

    if (url.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (url.qrCode === '') {
      try {
        const src = await qrcode.toDataURL(url.longUrl);

        url.set({
          qrCode: src,
        });

        await url.save();
      } catch (err) {
        console.log(err);
      }
    }

    res.send(url.qrCode);
  }
);

export { router as qrRouter };
