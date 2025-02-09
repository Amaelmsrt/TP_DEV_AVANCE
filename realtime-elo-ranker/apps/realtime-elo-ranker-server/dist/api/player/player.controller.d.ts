import { PlayerService } from './player.service';
import { Response } from 'express';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    createPlayer(createPlayerDto: {
        id: string;
    }, response: Response): Promise<any>;
    deleteAllPlayers(response: Response): Promise<void>;
}
