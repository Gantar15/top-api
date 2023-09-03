import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { INestApplication } from '@nestjs/common';
import { disconnect } from 'mongoose';

describe('Login (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', (done) => {
    const loginDto: AuthDto = {
      login: 'egor',
      password: 'password',
    };

    request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
        done();
      });
  });

  it('/auth/login (POST) - fail login', async () => {
    const loginDto: AuthDto = {
      login: 'nikolai',
      password: 'password',
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401, {
        message: 'Пользователь с таким email не найден',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/auth/login (POST) - fail password', async () => {
    const loginDto: AuthDto = {
      login: 'egor',
      password: 'qwerty',
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401, {
        message: 'Неправильный пароль',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
