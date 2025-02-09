import { MatchService } from './match.service';
import { PublishMatchDto } from './dto/publish-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    publishMatchResult(publishMatchDto: PublishMatchDto): Promise<any>;
}
