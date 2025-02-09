import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from '../src/api/player/player.service';
import { Player } from '../src/api/player/player.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'sqljs',
                autoSave: true,
                location: 'test-db.sqlite',
                entities: [Player],
                synchronize: true,
            }),
            TypeOrmModule.forFeature([Player]),
            EventEmitterModule.forRoot(),
        ],
        providers: [PlayerService],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    });

    it('should create a player', async () => {
        const player = await service.create({ id: 'playerTest1', rank: 1000 });
        expect(player).toBeDefined();
        expect(player.id).toBe('playerTest1');
        expect(player.rank).toBe(1000);
    });

    it('should find all players', async () => {
        const players = await service.findAll();
        expect(players.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await service.deleteAllPlayers();
    });
});