import { Module } from '@nestjs/common';
import { SecurityDevicesService } from './application/security-devices.service';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';
import { devicesProviders } from './infrastructure/devices.providers';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { BlacklistJwtRepository } from '../auth/infrastructure/blacklist-jwt.repository';
import { UsersService } from '../users/application/users.service';
import { ConvertFiltersForDB } from '../common/convert-filters/convertFiltersForDB';
import { Pagination } from '../common/pagination/pagination';
import { CaslAbilityFactory } from '../../ability/casl-ability.factory';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { MailsRepository } from '../mails/infrastructure/mails.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../../config/jwt/jwt-config';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveDevicesBannedUserUseCase } from './application/use-cases/remove-devices-bannedUser.use-case';
import { CreateDeviceUseCase } from './application/use-cases/create-device.use-case';
import { RemoveDevicesAfterLogoutUseCase } from './application/use-cases/remove-devices-after-logout.use-case';
import { RemoveDevicesExceptCurrentUseCase } from './application/use-cases/remove-devices-exceptCurrent.use-case';
import { RemoveDevicesByDeviceIdUseCase } from './application/use-cases/remove-devices-byDeviceId.use-case';

const securityDevicesCases = [
  CreateDeviceUseCase,
  RemoveDevicesAfterLogoutUseCase,
  RemoveDevicesBannedUserUseCase,
  RemoveDevicesByDeviceIdUseCase,
  RemoveDevicesExceptCurrentUseCase,
];

@Module({
  imports: [DatabaseModule, CqrsModule],
  controllers: [SecurityDevicesController],
  providers: [
    ConvertFiltersForDB,
    JwtService,
    JwtConfig,
    Pagination,
    CaslAbilityFactory,
    UsersRepository,
    MailsRepository,
    UsersService,
    BlacklistJwtRepository,
    SecurityDevicesRepository,
    SecurityDevicesService,
    ...securityDevicesCases,
    ...devicesProviders,
  ],
})
export class SecurityDevicesModule {}
