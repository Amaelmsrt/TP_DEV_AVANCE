import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { PlayerDto } from '../player/dto/player.dto';
import { RankingCacheService } from './ranking-cache.service';

@Injectable()
export class RankingService {
  private rankings: PlayerDto[] = [];

  constructor(
    private playerService: PlayerService,
    private rankingCacheService: RankingCacheService,
  ) {}

  /**
   * Get all rankings
   * @returns all rankings
   */
  getAllRankings(): Promise<PlayerDto[]> {
    const cachedRankings = this.rankingCacheService.getAllRankings();
    if (cachedRankings.length > 0) {
      return Promise.resolve(cachedRankings);
    }
    return this.playerService.findAll()
      .then(players => {
        if (!players || players.length === 0) {
          throw new Error('Le classement n\'est pas disponible car aucun joueur n\'existe');
        }
        const rankings = players.map(player => ({
          id: player.id,
          rank: player.rank,
        })).sort((a, b) => b.rank - a.rank);
        this.rankingCacheService.setRankings(rankings);
        return rankings;
      })
      .catch(error => {
        throw new Error(error.message || 'Erreur serveur');
      });
  }

  /**
   * Update player ranking
   * @param playerId Player id
   * @param newRank New rank
   * @returns Updated player
   */
  updateRanking(playerId: string, newRank: number): Promise<{ id: string, rank: number }> {
    return this.playerService.findOne(playerId)
      .then(player => {
        if (!player) {
          throw new Error('Player not found');
        }
        player.rank = newRank;
        return this.playerService.update(player);
      })
      .then(() => {
        const updatedRanking = this.rankingCacheService.updateRanking(playerId, newRank);
        return updatedRanking;
      })
      .catch(error => {
        throw new Error(error.message || 'Server error');
      });
  }
}
