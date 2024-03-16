import { app, prisma, serverStop} from '../src/index';
import supertest from 'supertest';

beforeAll(async () => {
  // setup
  await prisma.users.create({
    data: {
      name: 'Joejoe Matulacz',
      email: 'joejoematulacz@example.com',
      password: 'password',
      phone_number: '1234567890'
    }
  });
});

describe('GET requests', () => {

  // get all users
  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await supertest(app).get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
  });

  // get one user
  describe('GET /users/:id', () => {
    it('should return a single user', async () => {
      const newUser = await prisma.users.create({
        data: {
          name: 'LesBold',
          email: 'lesboldsmatulacz@example.com',
          password: 'password',
          phone_number: '1234567890'
        }
      });
      const response = await supertest(app).get(`/users/${newUser.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.any(Object));
    });
  });

  describe('GET /users/:id', () => {
    it('should return 404', async () => {
      const notUser = await supertest(app).get('/users/99');
      expect(notUser.statusCode).toBe(404);
      expect(notUser.body).toEqual({ message: 'User not found'});
    });
  });
});

afterAll(async () => {
  // teardown
  await prisma.users.deleteMany();
  await serverStop();
  await prisma.$disconnect();
});
