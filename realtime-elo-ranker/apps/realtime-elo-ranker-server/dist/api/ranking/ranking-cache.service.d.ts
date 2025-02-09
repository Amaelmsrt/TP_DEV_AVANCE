export declare class RankingCacheService {
    private rankings;
    getAllRankings(): {
        id: string;
        rank: number;
    }[];
    checkIfPlayerInRankings(playerId: string): boolean;
    updateRanking(playerId: string, newRank: number): {
        id: string;
        rank: number;
    };
    setRankings(rankings: {
        id: string;
        rank: number;
    }[]): void;
}
