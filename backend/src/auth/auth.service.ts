import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: googleUser.name,
          username: googleUser.email.split('@')[0],
          email: googleUser.email,
          avatarUrl: googleUser.avatarUrl,
          authProvider: 'GOOGLE',
          googleId: googleUser.googleId,
        },
      });

      const workspace = await this.prisma.workspace.create({
        data: { name: `${googleUser.name}'s Workspace` },
      });

      await this.prisma.workspaceMember.create({
        data: { userId: user.id, workspaceId: workspace.id },
      });
    }

    const accessToken = this.jwtService.sign({ sub: user.id });
    return { accessToken, user };
  }

  async loginAsGuest(existingToken?: string) {
    if (existingToken) {
      try {
        const payload = this.jwtService.verify<{ sub: string }>(existingToken);

        const existingUser = await this.prisma.user.findUnique({
          where: {
            id: payload.sub,
          },
        });

        if (existingUser?.authProvider === 'GUEST') {
          return {
            accessToken: existingToken,
            user: {
              id: existingUser.id,
              name: existingUser.name,
              username: existingUser.username,
            },
          };
        }
      } catch {
      }
    }

    const user = await this.prisma.user.create({
      data: {
        name: 'Guest User',
        username: this.generateGuestUsername(),
        authProvider: 'GUEST',
      },
    });

    const workspace = await this.prisma.workspace.create({
      data: {
        name: "Guest User's Workspace",
      },
    });

    await this.prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    };
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        title: true,
      },
    });
  }

  private generateGuestUsername(): string {
    return `guest-${randomUUID().slice(0, 6)}`;
  }
}
