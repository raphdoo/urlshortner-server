import express, { Request, Response } from 'express';

import { Url } from '../../models/url-shortener';
import { BadRequestError, NotFoundError } from '@ticket0/common';
import { Analytics } from '../../models/analytics';
import requestIp from 'request-ip';

const router = express.Router();

router.get('/:shortId', async (req: Request, res: Response) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortId });

    if (url) {
      const analytics = Analytics.build({
        url: url.shortUrl,
        userId: url.userId,
        location: requestIp.getClientIp(req)!,
      });

      await analytics.save();
      return res.status(302).redirect(url.longUrl);
    } else {
      throw new NotFoundError();
    }
  } catch (err) {
    throw new BadRequestError('server error');
  }
});

export { router as loadUrl };
