"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const player_service_1 = require("../player/player.service");
let MatchService = class MatchService {
    constructor(playerService, eventEmitter) {
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
        this.K = 32;
    }
    publishMatchResult(matchDto) {
        return Promise.all([
            this.playerService.findOne(matchDto.winner),
            this.playerService.findOne(matchDto.loser)
        ])
            .then(([winner, loser]) => {
            if (!winner || !loser)
                throw new Error('Winner or loser not found');
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
    calculateWinProbability(rankA, rankB) {
        return 1 / (1 + Math.pow(10, (rankB - rankA) / 400));
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map