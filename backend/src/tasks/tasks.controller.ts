import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

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

	@Post()
	create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
		return this.tasksService.create(user.userId, dto);
	}
}
