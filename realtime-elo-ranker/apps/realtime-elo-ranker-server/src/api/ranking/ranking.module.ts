import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PlayerModule } from '../player/player.module';
import { RankingCacheService } from './ranking-cache.service';

@Module({
  imports: [PlayerModule],
  controllers: [RankingController],
  providers: [RankingService, RankingCacheService],
  exports: [RankingService],
})
export class RankingModule {}
