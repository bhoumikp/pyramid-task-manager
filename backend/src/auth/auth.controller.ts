import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

type AuthenticatedUser = {
  userId: string;
};

type AuthCookies = {
  access_token?: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('guest')
  async loginAsGuest(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const NODE_ENV = this.configService.getOrThrow<string>('NODE_ENV');

    const cookies = request.cookies as AuthCookies;
    const result = await this.authService.loginAsGuest(cookies.access_token);

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getCurrentUser(user.userId);
  }
}
