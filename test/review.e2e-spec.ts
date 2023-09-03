import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { Types, disconnect } from 'mongoose';

import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { INestApplication } from '@nestjs/common';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
  name: 'test',
  title: 'title',
  description: 'description',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: 'egor',
  password: 'password',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = res.body.access_token;
  });

  it('/review/create (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201, (err, resp) => {
        createdId = resp.body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', (done) => {
    request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toHaveLength(1);
        done();
      });
  });

  it('/review/byProduct/:productId (GET) - fail', (done) => {
    request(app.getHttpServer())
      .get(`/review/byProduct/${new Types.ObjectId().toHexString()}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toHaveLength(0);
        done();
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', (done) => {
    request(app.getHttpServer())
      .delete(`/review/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, (err, resp) => {
        expect(resp.body.message).toEqual(REVIEW_NOT_FOUND);
        done();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
