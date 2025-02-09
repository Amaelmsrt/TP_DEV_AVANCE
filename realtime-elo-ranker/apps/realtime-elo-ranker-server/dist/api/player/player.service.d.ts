import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerService {
    private playerRepository;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    findAll(): Promise<Player[]>;
    checkIfPlayerExists(id: string): Promise<boolean>;
    create(player: CreatePlayerDto): Promise<Player>;
    findOne(id: string): Promise<Player | null>;
    update(player: Player): Promise<Player | null>;
    calculateAverageRank(): Promise<number>;
    deleteAllPlayers(): Promise<void>;
}
