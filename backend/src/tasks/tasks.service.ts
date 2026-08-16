import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userId: string, dto: CreateTaskDto) {
		const membership = await this.prisma.workspaceMember.findFirst({
		where: {
			userId,
		},
		});

		if (!membership) {
		throw new NotFoundException('Workspace not found');
		}

		return this.prisma.task.create({
		data: {
			title: dto.title,
			description: dto.description,
			priority: dto.priority,
			startDate: dto.startDate ? new Date(dto.startDate) : undefined,
			dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
			workspaceId: membership.workspaceId,
			createdById: userId,
		},
		});
	}

	async findAll(userId: string) {
		const membership = await this.prisma.workspaceMember.findFirst({
			where: {
				userId,
			},
		});

		if (!membership) {
			throw new NotFoundException('Workspace not found');
		}

		return this.prisma.task.findMany({
			where: {
				workspaceId: membership.workspaceId,
			},
			select: {
				id: true,
				title: true,
				description: true,
				status: true,
				priority: true,
				startDate: true,
				dueDate: true,
				createdAt: true,
				updatedAt: true,

				assignee: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}
}
