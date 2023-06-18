import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-19690.c257.us-east-1-3.ec2.cloud.redislabs.com',
    port: 19690,
  },
});

client.on('error', (error) => console.log(`Error : ${error}`));

(async () => {
  await client.connect();
  console.log('redis connected');
})();

export const cacheData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cacheKey = req.originalUrl;

    console.log(cacheKey);

    let result;

    const cacheResults = await client.get(cacheKey);

    if (cacheResults) {
      result = JSON.parse(cacheResults);
      res.send(result);
    } else {
      return next();
    }
  } catch (err) {
    console.log('Cache failed due to server error');
    next();
  }
};

export const getClient = () => {
  return client;
};
