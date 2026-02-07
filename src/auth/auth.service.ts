import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
    );

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  logout() {
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If email exists, reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    await this.usersService.updateResetToken(user.id, hashedToken, expiry);

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If email exists, reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const users = await this.usersService.findByResetToken(token);

    if (!users) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = users;
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const isValidToken = await bcrypt.compare(token, user.resetToken);
    if (!isValidToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.usersService.updatePassword(user.id, newPassword);

    return { message: 'Password reset successful' };
  }
}
