import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Find all players
   * @returns all players
   */
  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  /**
   * Check if a player exists
   * @param id player id
   * @returns true if player exists, false otherwise
   */
  checkIfPlayerExists(id: string): Promise<boolean> {
    return this.playerRepository.findOne({ where: { id } })
      .then(player => !!player);
  }

  /**
   * Create a new player
   * @param player player to create
   * @returns created player
   */
  create(player: CreatePlayerDto): Promise<Player> {
    return this.playerRepository.save(player)
      .then(player => {
        this.eventEmitter.emit('player.created', player);
        return player;
      });
  }

  /**
   * Find one player by id
   * @param id player id
   * @returns player
   */
  findOne(id: string): Promise<Player | null> {
    return this.playerRepository.findOne({ where: { id } });
  }

  /**
   * Update player information
   * @param player player to update
   * @returns updated player
   */
  update(player: Player): Promise<Player | null> {
    return this.playerRepository.save(player)
      .then(player => {
        this.eventEmitter.emit('rank.updated', player);
        return player;
      });
  }

  /**
   * Calculate the average rank of all players
   * @returns average rank
   */
  calculateAverageRank(): Promise<number> {
    return this.playerRepository.find()
      .then(players => {
        if (players.length === 0) {
          return 1000;
        }
        const totalRank = players.reduce((acc, player) => acc + player.rank, 0);
        return totalRank / players.length;
      });
  }

  /**
   * Delete all players from the database
   */
  deleteAllPlayers(): Promise<void> {
    return this.playerRepository.clear();
  }
}
