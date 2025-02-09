import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PublishMatchDto } from './dto/publish-match.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MatchController', () => {
  let matchController: MatchController;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {
            publishMatchResult: jest.fn(),
          },
        },
      ],
    }).compile();

    matchController = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  it('devrait être défini', () => {
    expect(matchController).toBeDefined();
  });

  it('devrait publier un match et retourner le résultat', async () => {
    const matchDto: PublishMatchDto = { winner: 'playerTest1', loser: 'playerTest2', draw: false };
    const matchResult = {
      winner: { id: 'playerTest1', rank: 1200 },
      loser: { id: 'playerTest2', rank: 1100 },
    };

    jest.spyOn(matchService, 'publishMatchResult').mockResolvedValue(matchResult);

    const result = await matchController.publishMatchResult(matchDto);

    expect(matchService.publishMatchResult).toHaveBeenCalledWith(matchDto);
    expect(result).toEqual(matchResult);
  });

  it('devrait retourner une erreur 422 si le service échoue', async () => {
    const matchDto: PublishMatchDto = { winner: 'playerTest1', loser: 'playerTest2', draw: false };
    const errorMessage = 'Erreur test';

    jest.spyOn(matchService, 'publishMatchResult').mockRejectedValue(new Error(errorMessage));

    await expect(matchController.publishMatchResult(matchDto)).rejects.toThrow(
      new HttpException(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY),
    );

    expect(matchService.publishMatchResult).toHaveBeenCalledWith(matchDto);
  });
});