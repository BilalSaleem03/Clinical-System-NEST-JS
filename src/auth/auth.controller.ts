import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type {Request , Response } from 'express';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  create(@Body(new ValidationPipe({whitelist: true})) loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/regenerate-tokens')
  regenerateTokens(@Req() req:Request) {
    return this.authService.regenerateTokens(req);
  }

  @Post('/verify-email')
  verificationEmail(@Body(new ValidationPipe({whitelist: true})) verifyEmailDto: VerifyEmailDto) {
    return this.authService.verificationEmail(verifyEmailDto.email , verifyEmailDto.role);
  }


  @Get('/check-hash-expiry')
  isHashExpired(@Query('role') role: string, @Query('email') email: string,){
    return this.authService.isHashExpired(email , role)
  }
  

  @Post('/reset-password')
  resetPassword(@Body(new ValidationPipe({whitelist: true})) resetPasswordDto:ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.role , resetPasswordDto.email , resetPasswordDto.hash , resetPasswordDto.newPassword);
  }
}
