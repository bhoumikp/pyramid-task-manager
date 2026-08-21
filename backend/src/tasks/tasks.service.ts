import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Prisma } from '../generated/prisma/client';

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  startDate: true,
  dueDate: true,
  labels: true,
  isPrivate: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,

  assignee: {
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

  watchers: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },

  subtasks: {
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      assignee: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc' as const,
    },
  },

  comments: {
    where: {
      parentId: null,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc' as const,
        },
      },
    },
    orderBy: {
      createdAt: 'asc' as const,
    },
  },

  activities: {
    select: {
      id: true,
      message: true,
      type: true,
      createdAt: true,
      actor: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
} as const;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    const workspaceId = await this.getUserWorkspace(userId);

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        projectId: dto.projectId || undefined,
        workspaceId: workspaceId,
        createdById: userId,
      },
      select: taskSelect,
    });

    await this.prisma.taskActivity.create({
      data: {
        taskId: task.id,
        actorId: userId,
        message: 'created this task',
        type: 'TASK_CREATED',
      },
    });

    return task;
  }

  async findAll(userId: string) {
    const workspaceId = await this.getUserWorkspace(userId);

    return this.prisma.task.findMany({
      where: {
        workspaceId: workspaceId,
      },
      select: taskSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, taskId: string) {
    const workspaceId = await this.getUserWorkspace(userId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId: workspaceId,
      },
      select: taskSelect,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const existing = await this.findOne(userId, taskId);

    const data: Prisma.TaskUpdateInput = {};
    const activityMessages: string[] = [];

    if (dto.title !== undefined && dto.title !== existing.title) {
      data.title = dto.title;
      activityMessages.push(`updated task title to "${dto.title}"`);
    }

    if (
      dto.description !== undefined &&
      dto.description !== existing.description
    ) {
      data.description = dto.description;
      activityMessages.push('updated description');
    }

    if (dto.status !== undefined && dto.status !== existing.status) {
      data.status = dto.status;
      activityMessages.push(
        `changed status from ${existing.status} to ${dto.status}`,
      );
    }

    if (dto.priority !== undefined && dto.priority !== existing.priority) {
      data.priority = dto.priority;
      activityMessages.push(
        `changed priority from ${existing.priority} to ${dto.priority}`,
      );
    }

    if (dto.assigneeId !== undefined) {
      data.assignee = dto.assigneeId
        ? {
            connect: {
              id: dto.assigneeId,
            },
          }
        : {
            disconnect: true,
          };

      if (dto.assigneeId !== existing.assignee?.id) {
        if (dto.assigneeId) {
          const newAssignee = await this.prisma.user.findUnique({
            where: {
              id: dto.assigneeId,
            },
          });

          activityMessages.push(
            `assigned task to ${newAssignee?.name ?? 'a member'}`,
          );
        } else {
          activityMessages.push('unassigned task');
        }
      }
    }

    if (dto.startDate !== undefined) {
      data.startDate = dto.startDate ? new Date(dto.startDate) : null;
      activityMessages.push('updated start date');
    }

    if (dto.dueDate !== undefined) {
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
      activityMessages.push('updated due date');
    }

    if (dto.labels !== undefined) {
      data.labels = dto.labels;
      activityMessages.push('updated labels');
    }

    if (dto.isPrivate !== undefined && dto.isPrivate !== existing.isPrivate) {
      data.isPrivate = dto.isPrivate;
      activityMessages.push(
        dto.isPrivate ? 'made task private' : 'made task public',
      );
    }

    if (dto.projectId !== undefined) {
      data.project = dto.projectId
        ? {
            connect: {
              id: dto.projectId,
            },
          }
        : {
            disconnect: true,
          };
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data,
    });

    for (const msg of activityMessages) {
      await this.prisma.taskActivity.create({
        data: {
          taskId,
          actorId: userId,
          message: msg,
        },
      });
    }

    return this.findOne(userId, taskId);
  }

  async toggleWatch(userId: string, taskId: string) {
    const task = await this.findOne(userId, taskId);
    const isWatching = task.watchers?.some((w) => w.id === userId);

    if (isWatching) {
      await this.prisma.task.update({
        where: { id: taskId },
        data: {
          watchers: {
            disconnect: { id: userId },
          },
        },
      });
      await this.prisma.taskActivity.create({
        data: {
          taskId,
          actorId: userId,
          message: 'stopped watching task',
        },
      });
    } else {
      await this.prisma.task.update({
        where: { id: taskId },
        data: {
          watchers: {
            connect: { id: userId },
          },
        },
      });
      await this.prisma.taskActivity.create({
        data: {
          taskId,
          actorId: userId,
          message: 'started watching task',
        },
      });
    }

    return this.findOne(userId, taskId);
  }

  async createSubtask(userId: string, taskId: string, dto: CreateSubtaskDto) {
    await this.findOne(userId, taskId);

    const subtask = await this.prisma.subtask.create({
      data: {
        title: dto.title,
        status: dto.status ?? 'TODO',
        priority: dto.priority ?? 'NONE',
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        taskId,
      },
    });

    await this.prisma.taskActivity.create({
      data: {
        taskId,
        actorId: userId,
        message: `added subtask "${dto.title}"`,
      },
    });

    return subtask;
  }

  async updateSubtask(
    userId: string,
    taskId: string,
    subtaskId: string,
    dto: UpdateSubtaskDto,
  ) {
    await this.findOne(userId, taskId);

    const subtask = await this.prisma.subtask.findFirst({
      where: {
        id: subtaskId,
        taskId,
      },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    const updated = await this.prisma.subtask.update({
      where: {
        id: subtaskId,
      },
      data: {
        title: dto.title,
        status: dto.status,
        priority: dto.priority,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });

    return updated;
  }

  async deleteSubtask(userId: string, taskId: string, subtaskId: string) {
    await this.findOne(userId, taskId);

    const subtask = await this.prisma.subtask.findFirst({
      where: {
        id: subtaskId,
        taskId,
      },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }

    await this.prisma.subtask.delete({
      where: {
        id: subtaskId,
      },
    });

    return { success: true };
  }

  async createComment(userId: string, taskId: string, dto: CreateCommentDto) {
    await this.findOne(userId, taskId);

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        parentId: dto.parentId,
        taskId,
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    await this.prisma.taskActivity.create({
      data: {
        taskId,
        actorId: userId,
        message: dto.parentId ? 'replied to a comment' : 'posted a comment',
        type: 'COMMENT',
      },
    });

    return comment;
  }

  async deleteComment(userId: string, taskId: string, commentId: string) {
    await this.findOne(userId, taskId);

    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return { success: true };
  }

  async getWorkspaceMembers(userId: string) {
    const workspaceId = await this.getUserWorkspace(userId);
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
    return members.map((m) => m.user);
  }

  private async getUserWorkspace(userId: string): Promise<string> {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
      },
      select: {
        workspaceId: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }

    return membership.workspaceId;
  }
}
