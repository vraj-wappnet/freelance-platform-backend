"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contracts_service_1 = require("./contracts.service");
const contracts_controller_1 = require("./contracts.controller");
const contract_entity_1 = require("./entities/contract.entity");
const users_module_1 = require("../users/users.module");
const projects_module_1 = require("../projects/projects.module");
let ContractsModule = class ContractsModule {
};
exports.ContractsModule = ContractsModule;
exports.ContractsModule = ContractsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([contract_entity_1.Contract]),
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
        ],
        controllers: [contracts_controller_1.ContractsController],
        providers: [contracts_service_1.ContractsService],
        exports: [contracts_service_1.ContractsService],
    })
], ContractsModule);
//# sourceMappingURL=contracts.module.js.map