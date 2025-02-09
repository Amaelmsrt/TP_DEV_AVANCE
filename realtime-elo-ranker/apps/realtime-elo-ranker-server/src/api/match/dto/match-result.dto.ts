import { PlayerDto } from "src/api/player/dto/player.dto";

export class MatchResultDto {
    winner: PlayerDto;
    loser: PlayerDto;
}
