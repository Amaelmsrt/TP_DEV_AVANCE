import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from '../player/player.service';
import { PublishMatchDto } from './dto/publish-match.dto';
import { MatchResultDto } from './dto/match-result.dto';
export declare class MatchService {
    private playerService;
    private eventEmitter;
    private readonly K;
    constructor(playerService: PlayerService, eventEmitter: EventEmitter2);
    publishMatchResult(matchDto: PublishMatchDto): Promise<MatchResultDto>;
    private calculateWinProbability;
}
