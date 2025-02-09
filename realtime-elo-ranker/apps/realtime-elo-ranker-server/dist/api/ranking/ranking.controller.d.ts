import { RankingService } from './ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { Response } from 'express';
export declare class RankingController {
    private readonly rankingService;
    private eventEmitter;
    constructor(rankingService: RankingService, eventEmitter: EventEmitter2);
    getAllRankings(response: Response): Promise<Response<any>>;
    sse(): Observable<MessageEvent>;
}
