import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/url/${id}`)
    .set('Cookie', await global.signin())
    .send({})
    .expect(404);
});

it('returns a 401 if the user does not own the shortUrl', async () => {
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
    .delete(`/api/url/${response.body.id}`)
    .set('Cookie', global.auth())
    .send({});
  expect(urlResponse.status).toEqual(401);
});

it('successfully provides the analytics of the data', async () => {
  const longUrl =
    'https://www.nairaland.com/6535844/tips-how-identify-fake-job';
  const cookie = await global.signin();
  const response = await request(app)
    .post('/api/url/shorten')
    .set('Cookie', cookie)
    .send({
      longUrl,
    })
    .expect(201);

  const urlResponse = await request(app)
    .delete(`/api/url/${response.body.id}`)
    .set('Cookie', cookie)
    .send({});
  expect(urlResponse.status).toEqual(200);
  expect(urlResponse.body.message).toEqual('url is deleted');
});
