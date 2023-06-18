import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, BadRequestError } from '@ticket0/common';

import { User } from '../../models/user';
import { Password } from '../../../services/password';

import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Email or password incorrect');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Email or password incorrect');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    res
      .status(200)
      .cookie('session', userJwt, {
        expires: new Date(
          Date.now() +
            parseInt(process.env.COOKIE_EXPIRES_TIME!) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .send({ user: existingUser });
  }
);

export { router as signinRouter };
