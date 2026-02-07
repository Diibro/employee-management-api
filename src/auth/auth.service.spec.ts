import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updateResetToken: jest.fn(),
            findByResetToken: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    mailService = module.get(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { email: 'test@test.com', password: 'password123' };
      const user = { id: '1', email: 'test@test.com', password: 'hashed' };

      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(user as any);
      jwtService.sign.mockReturnValue('token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe(user.email);
    });

    it('should throw ConflictException if email exists', async () => {
      const registerDto = { email: 'test@test.com', password: 'password123' };
      usersService.findByEmail.mockResolvedValue({} as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      usersService.findByEmail.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe(user.email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'test@test.com', password: 'wrong' };

      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should return logout message', () => {
      const result = service.logout();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
