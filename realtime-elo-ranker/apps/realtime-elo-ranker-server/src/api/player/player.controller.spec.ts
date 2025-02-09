import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from '../player/player.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let mockPlayerService: any;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockPlayerService = {
      deleteAllPlayers: jest.fn(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    }).compile();

    playerController = module.get<PlayerController>(PlayerController);
  });

  describe('deleteAllPlayers', () => {
    it('devrait supprimer tous les joueurs', async () => {
      mockPlayerService.deleteAllPlayers.mockResolvedValue(undefined);

      await playerController.deleteAllPlayers(mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockPlayerService.deleteAllPlayers).toHaveBeenCalled();
    });
  });
});
