import { PlayerService } from '../player/player.service';
import { PlayerDto } from '../player/dto/player.dto';
import { RankingCacheService } from './ranking-cache.service';
export declare class RankingService {
    private playerService;
    private rankingCacheService;
    private rankings;
    constructor(playerService: PlayerService, rankingCacheService: RankingCacheService);
    getAllRankings(): Promise<PlayerDto[]>;
    updateRanking(playerId: string, newRank: number): Promise<{
        id: string;
        rank: number;
    }>;
}
