import request from 'supertest';
import { app } from '../../../app';

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.user.email).toEqual('test@test.com');
});

it('responds with 204 if current user is null', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(204);
});
