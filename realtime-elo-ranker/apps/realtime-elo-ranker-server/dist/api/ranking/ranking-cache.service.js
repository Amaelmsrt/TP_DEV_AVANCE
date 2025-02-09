"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingCacheService = void 0;
const common_1 = require("@nestjs/common");
let RankingCacheService = class RankingCacheService {
    constructor() {
        this.rankings = [];
    }
    getAllRankings() {
        return this.rankings;
    }
    checkIfPlayerInRankings(playerId) {
        return this.rankings.findIndex(p => p.id === playerId) !== -1;
    }
    updateRanking(playerId, newRank) {
        const playerIndex = this.rankings.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
            this.rankings[playerIndex].rank = newRank;
        }
        else {
            this.rankings.push({ id: playerId, rank: newRank });
        }
        this.rankings.sort((a, b) => b.rank - a.rank);
        return { id: playerId, rank: newRank };
    }
    setRankings(rankings) {
        this.rankings = rankings;
    }
};
exports.RankingCacheService = RankingCacheService;
exports.RankingCacheService = RankingCacheService = __decorate([
    (0, common_1.Injectable)()
], RankingCacheService);
//# sourceMappingURL=ranking-cache.service.js.map