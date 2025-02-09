import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerDto } from '../player/dto/player.dto';
import { Response } from 'express';
import { Player } from '../player/player.entity';
import { HttpException } from '@nestjs/common';

describe('RankingController', () => {
  let rankingController: RankingController;
  let rankingService: RankingService;
  let eventEmitter: EventEmitter2;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: {
            getAllRankings: jest.fn().mockResolvedValue([{ id: 'playerTest1', rank: 1000 }]),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
            on: jest.fn().mockReturnThis(),
            off: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    rankingController = module.get<RankingController>(RankingController);
    rankingService = module.get<RankingService>(RankingService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

  });
  it('should be defined', () => {
    expect(rankingController).toBeDefined();
  });
  describe('getAllRankings', () => {
    it('should return all rankings', () => {
      const result: PlayerDto[] = [{ id: 'playerTest1', rank: 1000 }];
      jest.spyOn(rankingService, 'getAllRankings').mockResolvedValue(result);
      return rankingController.getAllRankings(mockResponse as Response).then(() => {
        expect(mockResponse.json).toHaveBeenCalledWith(result);
      });
    });
    it('should throw an error if no rankings are found', () => {
      jest.spyOn(rankingService, 'getAllRankings').mockRejectedValue(new Error('No rankings found'));
      return rankingController.getAllRankings(mockResponse as Response).catch(error => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('No rankings found');
      });
    });
  });
  describe('sse', () => {
    it('should return an observable of ranking updates', (done) => {
      const playerCreated = { id: 'playerTest1', rank: 1000 } as Player;
      const rankUpdated = { id: 'playerTest2', rank: 900 } as Player;
      jest.spyOn(eventEmitter, 'on').mockImplementation((event, callback) => {
        if (event === 'player.created') {
          callback(playerCreated);
        } else if (event === 'rank.updated') {
          callback(rankUpdated);
        }
        return eventEmitter;
      });
      const observable = rankingController.sse();
      const events: MessageEvent[] = [];
      observable.subscribe({
        next: (event) => {
          events.push(event);
          if (events.length === 2) {
            expect(events[0].data.type).toBe('RankingUpdate');
            expect(events[0].data.player).toEqual({ id: 'playerTest1', rank: 1000 });
            expect(events[1].data.type).toBe('RankingUpdate');
            expect(events[1].data.player).toEqual({ id: 'playerTest2', rank: 900 });
            done();
          }
        },
        error: done.fail,
      });

      eventEmitter.emit('player.created', playerCreated);
      eventEmitter.emit('rank.updated', rankUpdated);
    });
  });
});