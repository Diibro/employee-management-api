import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateResetToken(
    userId: string,
    token: string,
    expiry: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
  }
}
