import { app, prisma, serverStop } from '../src/index';
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

describe('POST requests', () => {

  // normal
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const content = {
        name: 'LesBolds',
        email: 'lesboldsmatulacz@example.com',
        password: 'password',
        phone_number: '1234567890'
      }
      const response = await supertest(app).post('/users').send(content);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expect.any(Object));
    });
  })

  // not meeting field requirements
  describe('POST /users incomplete field error', () => {
    it('should return "all fields are required"', async () => {
      const brokenContent = {
        name: '',
        email: '',
        password: '',
        phone_number: ''
      }
      const response = await supertest(app).post('/users').send(brokenContent)
      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual({ message: "All fields are required"})
    });
  });

  describe('POST /users under name character count error', () => {
    it('should return error about names or sumthn dunno am tired', async () => {
      const nameError = {
        name: "eh",
        email: 'heehee@test.ph',
        password: 'password',
        phone_number: '1234567890'
      }
      const res = await supertest(app).post('/users').send(nameError);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Name must be between 3 and 20 characters'});
    });
  });

  //at this point got tired and bored so imma pop dem vowels gl reading
  describe('PST /srs vr nm chrctr cnt rrr', () => {
    it('shld rtrn rrr bt nms bng btwn 3 nd 20 chrctrs', async () => {
      const nmRRR = {
        name: 'uvuvwevwevwe unyetenyevwe ugwemubwem osas',
        email: 'osas@plslaughimfunnysometimes.ph',
        password: 'psswrrrrdd',
        phone_number: '1234567890'
      }
      const rspns = await supertest(app).post('/users').send(nmRRR);
      expect(rspns.statusCode).toBe(400);
      expect(rspns.body).toEqual({ message: "Name must be between 3 and 20 characters"});
    });
  });

  describe('PST /srs ml rrr', () => {
    it('shld rtrn rrr syng ml mst b vld ml frmt', async() => {
      const mlRRR = {
        name: 'Brrrrr',
        email: 'n',
        password: 'psswrrrdddd',
        phone_number: '1234567890'
      }
      const rspns = await supertest(app).post('/users').send(mlRRR);
      expect(rspns.statusCode).toBe(400);
      expect(rspns.body).toEqual({ message: "Email must be in a valid email format"});
    });
  });
});

afterAll(async () => {
  // teardown
  await prisma.users.deleteMany();
  await serverStop();
  await prisma.$disconnect();
});
