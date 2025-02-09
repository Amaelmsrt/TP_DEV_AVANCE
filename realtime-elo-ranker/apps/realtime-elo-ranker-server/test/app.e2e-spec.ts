import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  }, 20000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('MatchController', () => {
    it('/api/match (POST)', () => {
      const matchDto = { winner: 'player1', loser: 'player2', draw: false };
      return request(app.getHttpServer())
        .post('/api/match')
        .send(matchDto)
        .expect(201)
        .then(response => {
          expect(response.body.winner).toBeDefined();
          expect(response.body.loser).toBeDefined();
        });
    });
  });

  describe('RankingController', () => {
    it('/api/ranking (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/ranking')
        .expect(200)
        .then(response => {
          expect(response.body).toBeInstanceOf(Array);
        });
    });    
  });

  describe('PlayerController', () => {
    it('/api/player (POST)', () => {
      const playerDto = { id: 'player1', rank: 1000 };
      return request(app.getHttpServer())
        .post('/api/player')
        .send(playerDto)
        .expect(res => {
          if (res.status === 409) {
            console.warn('Player already exists');
          }
          expect([201, 409]).toContain(res.status);
        })
        .then(response => {
          if (response.status === 201) {
            expect(response.body.id).toBe(playerDto.id);
            expect(response.body.rank).toBe(playerDto.rank);
          }
        });
    });
  });
});