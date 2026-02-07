import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';

    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
          expect(response.body.user).toHaveProperty('email', testEmail);
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
        });
    });

    it('/auth/logout (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
        });
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
