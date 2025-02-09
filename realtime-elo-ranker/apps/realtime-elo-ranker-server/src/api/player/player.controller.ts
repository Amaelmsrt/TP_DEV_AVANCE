import { Controller, Post, Body, HttpException, HttpStatus, Get, Delete, Res } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { Response } from 'express';

@Controller('api/player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    /**
     * Create a player
     * @param createPlayerDto player id
     * @param response HTTP response object
     * @returns created player
     */
    @Post()
    async createPlayer(@Body() createPlayerDto: { id: string }, @Res() response: Response): Promise<any> {
      try {
        const playerExists = await this.playerService.checkIfPlayerExists(createPlayerDto.id);
        if (playerExists) {
          return response.status(HttpStatus.CONFLICT).json({
            code: 409,
            message: 'Le joueur existe déjà'
          });
        }
        const averageRank = await this.playerService.calculateAverageRank();
        const rankToAssign = averageRank === undefined || averageRank === 0 ? 1000 : averageRank;
        const player = new Player();
        player.id = createPlayerDto.id;
        player.rank = rankToAssign;
        const createdPlayer = await this.playerService.create(player);
        response.status(HttpStatus.CREATED).json(createdPlayer);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                code: 500,
                message: 'Erreur serveur'
            });
        }
    }
    

    /**
     * Delete all players
     * @param response HTTP response object
     * @returns void
     */
    @Delete('all')
    deleteAllPlayers(@Res() response: Response): Promise<void> {
        return this.playerService.deleteAllPlayers()
            .then(() => {
                response.status(HttpStatus.NO_CONTENT).send();
            })
            .catch(err => {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    code: 500,
                    message: 'Erreur serveur'
                });
            });
    }
}
