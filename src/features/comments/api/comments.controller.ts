import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { LikeStatusDto } from '../dto/like-status.dto';
import { User } from '../../users/infrastructure/schemas/user.schema';
import { AbilitiesGuard } from '../../../ability/abilities.guard';
import { CheckAbilities } from '../../../ability/abilities.decorator';
import { Action } from '../../../ability/roles/action.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NoneStatusGuard } from '../../auth/guards/none-status.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ChangeLikeStatusCommentCommand } from '../application/use-cases/change-likeStatus-comment.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use-cases/update-comment.use-case';
import { RemoveCommentCommand } from '../application/use-cases/remove-comment.use-case';
import { IdParams } from '../../common/params/id.params';
import { CommentIdParams } from '../../common/params/commentId.params';
import { CurrentUserDto } from '../../users/dto/currentUser.dto';

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commandBus: CommandBus,
  ) {}

  @Get(':id')
  @UseGuards(NoneStatusGuard)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.CREATE, subject: User })
  async findComment(@Request() req: any, @Param() params: IdParams) {
    const currentUserDto: CurrentUserDto = req.user;
    return this.commentsService.findCommentById(params.id, currentUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':commentId')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Request() req: any,
    @Param() params: CommentIdParams,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const currentUserDto: CurrentUserDto = req.user;
    return await this.commandBus.execute(
      new UpdateCommentCommand(
        params.commentId,
        updateCommentDto,
        currentUserDto,
      ),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async removeComment(@Request() req: any, @Param() params: CommentIdParams) {
    const currentUserDto: CurrentUserDto = req.user;
    return await this.commandBus.execute(
      new RemoveCommentCommand(params.commentId, currentUserDto),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  async changeLikeStatusComment(
    @Request() req: any,
    @Param() params: CommentIdParams,
    @Body() likeStatusDto: LikeStatusDto,
  ) {
    const currentUserDto: CurrentUserDto = req.user;
    return await this.commandBus.execute(
      new ChangeLikeStatusCommentCommand(
        params.commentId,
        likeStatusDto,
        currentUserDto,
      ),
    );
  }
}
