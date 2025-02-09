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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const ranking_cache_service_1 = require("./ranking-cache.service");
let RankingService = class RankingService {
    constructor(playerService, rankingCacheService) {
        this.playerService = playerService;
        this.rankingCacheService = rankingCacheService;
        this.rankings = [];
    }
    getAllRankings() {
        const cachedRankings = this.rankingCacheService.getAllRankings();
        if (cachedRankings.length > 0) {
            return Promise.resolve(cachedRankings);
        }
        return this.playerService.findAll()
            .then(players => {
            if (!players || players.length === 0) {
                throw new Error('Le classement n\'est pas disponible car aucun joueur n\'existe');
            }
            const rankings = players.map(player => ({
                id: player.id,
                rank: player.rank,
            })).sort((a, b) => b.rank - a.rank);
            this.rankingCacheService.setRankings(rankings);
            return rankings;
        })
            .catch(error => {
            throw new Error(error.message || 'Erreur serveur');
        });
    }
    updateRanking(playerId, newRank) {
        return this.playerService.findOne(playerId)
            .then(player => {
            if (!player) {
                throw new Error('Player not found');
            }
            player.rank = newRank;
            return this.playerService.update(player);
        })
            .then(() => {
            const updatedRanking = this.rankingCacheService.updateRanking(playerId, newRank);
            return updatedRanking;
        })
            .catch(error => {
            throw new Error(error.message || 'Server error');
        });
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        ranking_cache_service_1.RankingCacheService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map