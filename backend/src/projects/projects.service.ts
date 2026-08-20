import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const projectSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  startDate: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  lead: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },
} as const;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserWorkspace(userId: string): Promise<string> {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId },
    });

    if (membership) {
      return membership.workspaceId;
    }

    const defaultWorkspace = await this.prisma.workspace.findFirst();
    if (defaultWorkspace) {
      return defaultWorkspace.id;
    }

    const newWorkspace = await this.prisma.workspace.create({
      data: {
        name: 'Default Workspace',
        members: {
          create: {
            userId,
          },
        },
      },
    });

    return newWorkspace.id;
  }

  async create(userId: string, dto: CreateProjectDto) {
    const workspaceId = await this.getUserWorkspace(userId);

    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? 'PLANNING',
        priority: dto.priority ?? 'NONE',
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        leadId: dto.leadId || undefined,
        workspaceId,
        createdById: userId,
      },
      select: projectSelect,
    });
  }

  async findAll(userId: string) {
    const workspaceId = await this.getUserWorkspace(userId);

    return this.prisma.project.findMany({
      where: {
        workspaceId,
      },
      select: projectSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, projectId: string) {
    const workspaceId = await this.getUserWorkspace(userId);

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
      select: projectSelect,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    await this.findOne(userId, projectId);

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.startDate !== undefined) {
      updateData.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.dueDate !== undefined) {
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }
    if (dto.leadId !== undefined) {
      updateData.leadId = dto.leadId;
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
      select: projectSelect,
    });
  }

  async remove(userId: string, projectId: string) {
    await this.findOne(userId, projectId);

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true };
  }
}
