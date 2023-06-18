import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { Url } from '../../models/url-shortener';

it('has a route handler listening to /api/url/shorten for post requests', async () => {
  const response = await request(app).post('/api/url/shorten').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  const response = await request(app).post('/api/url/shorten').send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is not signed in', async () => {
  const response = await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error when no url is provided', async () => {
  await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({
      longUrl: '',
    })

    .expect(400);
});

it('returns an error when an invalid url is provided', async () => {
  await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({
      longUrl: 'gdgdjfncbchndnc',
    })

    .expect(400);
});

it('returns an error when an invalid customDomain is provided', async () => {
  await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({
      longUrl: 'https://www.nairaland.com/6535844/tips-how-identify-fake-job',
      customUrl: 'gdgdjfncbchndnc',
    })

    .expect(400);
});

it('create a shortened url when inputs are valid', async () => {
  const longUrl =
    'https://www.nairaland.com/6535844/tips-how-identify-fake-job';

  await request(app)
    .post('/api/url/shorten')
    .set('Cookie', await global.signin())
    .send({
      longUrl,
    })

    .expect(201);

  const url = await Url.find({});
  expect(url[0].longUrl).toEqual(longUrl);
  expect(url[0].shortUrl).toEqual(`http://localhost:4000/${url[0].shortCode}`);
});
