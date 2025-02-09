import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { PublishMatchDto } from './dto/publish-match.dto';
import { MatchResultDto } from './dto/match-result.dto';

@Injectable()
export class MatchService {
  private readonly K = 32;

  constructor(
    private playerService: PlayerService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Publish match result
   * @param matchDto Match result
   * @returns Match result
   */
  publishMatchResult(matchDto: PublishMatchDto): Promise<MatchResultDto> {
    return Promise.all([
      this.playerService.findOne(matchDto.winner),
      this.playerService.findOne(matchDto.loser)
    ])
      .then(([winner, loser]) => {
        if (!winner || !loser) throw new Error('Winner or loser not found');
  
        const WeWinner = this.calculateWinProbability(winner.rank, loser.rank);
        const WeLoser = this.calculateWinProbability(loser.rank, winner.rank);
        const scoreWinner = matchDto.draw ? 0.5 : 1;
        const scoreLoser = matchDto.draw ? 0.5 : 0;
  
        winner.rank = Math.round(winner.rank + this.K * (scoreWinner - WeWinner));
        loser.rank = Math.round(loser.rank + this.K * (scoreLoser - WeLoser));
  
        return this.playerService.update(winner)
          .then(() => this.playerService.update(loser))
          .then(() => ({
            winner: { id: winner.id, rank: winner.rank },
            loser: { id: loser.id, rank: loser.rank }
          }));
      });
  }
  

  /**
   * Calculate win probability
   * @param rankA
   * @param rankB 
   * @returns win probability
   */
  private calculateWinProbability(rankA: number, rankB: number): number {
    return 1 / (1 + Math.pow(10, (rankB - rankA) / 400));
  }
}
