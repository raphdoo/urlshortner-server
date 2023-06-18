import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/signout', (req: Request, res: Response) => {
  res
    .status(200)
    .cookie('session', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .send({ message: 'Signout successful' });
});

export { router as signoutRouter };
