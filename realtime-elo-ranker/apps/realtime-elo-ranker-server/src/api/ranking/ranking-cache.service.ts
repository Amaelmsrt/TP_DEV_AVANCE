import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingCacheService {
    private rankings: { id: string, rank: number }[] = [];

    /**
     * Get all rankings
     * @returns all rankings
     */
    getAllRankings(): { id: string, rank: number }[] {
        return this.rankings;
    }

    /**
     * Check if a player is in the rankings
     * @param playerId Player id
     * @returns true if player is in the rankings, false otherwise
     */
    checkIfPlayerInRankings(playerId: string): boolean {
        return this.rankings.findIndex(p => p.id === playerId) !== -1;
    }

    /**
     * Update player ranking
     * @param playerId Player id
     * @param newRank New rank
     * @returns Updated player
     */
    updateRanking(playerId: string, newRank: number): { id: string, rank: number } {
        const playerIndex = this.rankings.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
            this.rankings[playerIndex].rank = newRank;
        } else {
            this.rankings.push({ id: playerId, rank: newRank });
        }
        this.rankings.sort((a, b) => b.rank - a.rank);
        return { id: playerId, rank: newRank };
    }

    /**
     * Set all rankings
     * @param rankings Array of rankings
     */
    setRankings(rankings: { id: string, rank: number }[]): void {
        this.rankings = rankings;
    }
}