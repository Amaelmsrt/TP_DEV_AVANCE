import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MatchService } from './match.service';
import { PublishMatchDto } from './dto/publish-match.dto';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /**
   * Publish match result.
   * @param publishMatchDto Match result
   * @returns Match result
   */
  @Post()
  publishMatchResult(@Body() publishMatchDto: PublishMatchDto): Promise<any> {
    return this.matchService.publishMatchResult(publishMatchDto)
      .then(result => result)
      .catch(error => {
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      });
  }
}