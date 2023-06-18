import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { Url } from '../../models/url-shortener';
import { Analytics } from '../../models/analytics';

it('has a route handler listening to /:shortId for post requests', async () => {
  const response = await request(app).get('/:shortId').send({});

  expect(response.status).not.toEqual(404);
});

it('returns an error when url provided is not valid', async () => {
  const longUrl =
    'https://www.nairaland.com/6535844/tips-how-identify-fake-job';

  const shortCode = 'shgfjfjfn';

  const response = await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({
      longUrl,
    })
    .expect(201);

  const urlResponse = await request(app)
    .get(`/${shortCode}`)
    .send()

    .expect(400);
});
it('returns a status 302 and also updates Analytics schema when successful', async () => {
  const longUrl =
    'https://www.nairaland.com/6535844/tips-how-identify-fake-job';

  const response = await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({
      longUrl,
    })
    .expect(201);

  const urlResponse = await request(app)
    .get(`/${response.body.shortCode}`)
    .send()

    .expect(302);

  const analytics = await Analytics.find({});
  expect(analytics[0].url).toEqual(
    `http://localhost:4000/${response.body.shortCode}`
  );
});
