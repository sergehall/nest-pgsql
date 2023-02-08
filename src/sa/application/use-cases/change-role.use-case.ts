import { UsersEntity } from '../../../users/entities/users.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ChangeRoleCommand {
  constructor(public newUser: UsersEntity) {}
}

@CommandHandler(ChangeRoleCommand)
export class ChangeRoleUseCase implements ICommandHandler<ChangeRoleCommand> {
  constructor(protected usersRepository: UsersRepository) {}
  async execute(command: ChangeRoleCommand): Promise<UsersEntity | null> {
    return await this.usersRepository.changeRole(command.newUser);
  }
}
