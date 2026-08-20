import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth 2.0 redirect flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const NODE_ENV = this.configService.get<string>('NODE_ENV', 'development');
    const FRONTEND_URL = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    const result = await this.authService.validateGoogleUser(req.user);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${FRONTEND_URL}/tasks`);
  }

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
