import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from '../player/player.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PlayerModule, EventEmitterModule.forRoot()],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
