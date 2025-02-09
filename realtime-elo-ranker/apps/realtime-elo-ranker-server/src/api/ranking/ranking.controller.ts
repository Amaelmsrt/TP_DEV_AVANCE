import { Controller, Get, HttpException, HttpStatus, Sse, Res } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Player } from '../player/player.entity';
import { Response } from 'express';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get all rankings
   * @returns all rankings
   */
  @Get()
  getAllRankings(@Res() response: Response): Promise<Response<any>> {
    return this.rankingService.getAllRankings()
      .then(rankings => {
        return response.json(rankings);
      })
      .catch(error => {
        throw new HttpException(error.message || 'Erreur serveur', HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  /**
   * Server-Sent Events
   * @returns ranking updates
   */
  @Sse('events')
  sse(): Observable<MessageEvent> {
    const playerCreated = fromEvent(this.eventEmitter, 'player.created').pipe(
      map((player: Player) => {
        return {
          data: {
            type: 'RankingUpdate',
            player: {
              id: player.id,
              rank: player.rank,
            },
          },
        } as MessageEvent;
      }),
    );

    const rankUpdated = fromEvent(this.eventEmitter, 'rank.updated').pipe(
      map((player: Player) => {
        return {
          data: {
            type: 'RankingUpdate',
            player: {
              id: player.id,
              rank: player.rank,
            },
          },
        } as MessageEvent;
      }),
    );

    return merge(playerCreated, rankUpdated);
  }
}
