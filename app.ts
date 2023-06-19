import express, { Request, Response } from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');

// importing user router
import { currentUserRouter } from './src/routes/user/current-user';
import { signinRouter } from './src/routes/user/signin';
import { signoutRouter } from './src/routes/user/signout';
import { signupRouter } from './src/routes/user/signup';

//importing urlshortener router
import { shortenUrl } from './src/routes/urlshortener/shorten_url';
import { loadUrl } from './src/routes/urlshortener/loadUrl';
import { qrRouter } from './src/routes/urlshortener/qr';

import { errorHandler, NotFoundError } from '@ticket0/common';
import { AnalyticsRouter } from './src/routes/urlshortener/analytics';
import { historyRouter } from './src/routes/urlshortener/history';
import { deleteLinkRouter } from './src/routes/urlshortener/deletelink';
import { customUrl } from './src/routes/urlshortener/customUrl';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'https://urlshortener-hd3k.onrender.com',
      'https://raph0.stoplight.io',
    ],
    credentials: true,
  })
);

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(rateLimiter);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(shortenUrl);
app.use(loadUrl);
app.use(qrRouter);
app.use(AnalyticsRouter);
app.use(historyRouter);
app.use(deleteLinkRouter);
app.use(customUrl);

// setting up swagger
// endpoint = http://localhost:4000/docs/

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
