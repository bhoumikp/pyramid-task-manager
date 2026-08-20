import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

type AuthenticatedUser = {
  userId: string;
};

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.tasksService.findAll(user.userId);
  }

  @Get('members')
  getMembers(@CurrentUser() user: AuthenticatedUser) {
    return this.tasksService.getWorkspaceMembers(user.userId);
  }

  @Get(':id')
  getTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.findOne(user.userId, taskId);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.userId, taskId, dto);
  }

  @Post(':id/watch')
  toggleWatch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.toggleWatch(user.userId, taskId);
  }

  @Post(':id/subtasks')
  createSubtask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.tasksService.createSubtask(user.userId, taskId, dto);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(
      user.userId,
      taskId,
      subtaskId,
      dto,
    );
  }

  @Delete(':id/subtasks/:subtaskId')
  deleteSubtask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.tasksService.deleteSubtask(user.userId, taskId, subtaskId);
  }

  @Post(':id/comments')
  createComment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.createComment(user.userId, taskId, dto);
  }

  @Delete(':id/comments/:commentId')
  deleteComment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.tasksService.deleteComment(user.userId, taskId, commentId);
  }
}
