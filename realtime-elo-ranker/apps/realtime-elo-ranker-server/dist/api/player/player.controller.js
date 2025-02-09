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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("./player.service");
const player_entity_1 = require("./player.entity");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async createPlayer(createPlayerDto, response) {
        try {
            const playerExists = await this.playerService.checkIfPlayerExists(createPlayerDto.id);
            if (playerExists) {
                return response.status(common_1.HttpStatus.CONFLICT).json({
                    code: 409,
                    message: 'Le joueur existe déjà'
                });
            }
            const averageRank = await this.playerService.calculateAverageRank();
            const rankToAssign = averageRank === undefined || averageRank === 0 ? 1000 : averageRank;
            const player = new player_entity_1.Player();
            player.id = createPlayerDto.id;
            player.rank = rankToAssign;
            const createdPlayer = await this.playerService.create(player);
            response.status(common_1.HttpStatus.CREATED).json(createdPlayer);
        }
        catch (err) {
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                code: 500,
                message: 'Erreur serveur'
            });
        }
    }
    deleteAllPlayers(response) {
        return this.playerService.deleteAllPlayers()
            .then(() => {
            response.status(common_1.HttpStatus.NO_CONTENT).send();
        })
            .catch(err => {
            response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                code: 500,
                message: 'Erreur serveur'
            });
        });
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "createPlayer", null);
__decorate([
    (0, common_1.Delete)('all'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "deleteAllPlayers", null);
exports.PlayerController = PlayerController = __decorate([
    (0, common_1.Controller)('api/player'),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
//# sourceMappingURL=player.controller.js.map