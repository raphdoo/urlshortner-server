import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { BadRequestError, validateRequest } from '@ticket0/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    res
      .status(201)
      .cookie('session', userJwt, {
        expires: new Date(
          Date.now() +
            parseInt(process.env.COOKIE_EXPIRES_TIME!) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .send({ user });
  }
);

export { router as signupRouter };
