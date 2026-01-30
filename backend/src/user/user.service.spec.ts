import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '@/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  describe('createUser', () => {
    it('should create a new user and return a token', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'password',
      };

      userRepository.findOne.mockResolvedValueOnce(null); // username check
      userRepository.findOne.mockResolvedValueOnce(null); // email check
      userRepository.save.mockImplementation(
        async (user) =>
          ({
            id: 1,
            ...user,
          }) as any,
      );

      const result = await service.createUser(createUserDto);

      expect(result.user.username).toBe('john');
      expect(result.user.email).toBe('john@example.com');
      expect(result.user.token).toBeDefined();
    });

    it('should throw an error if email or username exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'password',
      };

      // Simulate existing user
      userRepository.findOne.mockResolvedValueOnce({} as any);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('loginUser', () => {
    it('should return user if credentials are correct', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password',
      };

      const userEntity = {
        id: 1,
        email: 'john@example.com',
        username: 'john',
        password: await bcrypt.hash('password', 10),
      } as UserEntity;

      userRepository.findOne.mockResolvedValueOnce(userEntity);

      // Mock bcrypt compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await service.loginUser(loginDto);
      expect(result.username).toBe('john');
      expect(result.password).toBeUndefined();
    });

    it('should throw if email not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexist@example.com',
        password: 'password',
      };

      userRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.loginUser(loginDto)).rejects.toThrow(HttpException);
    });

    it('should throw if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const userEntity = {
        id: 1,
        email: 'john@example.com',
        username: 'john',
        password: await bcrypt.hash('password', 10),
      } as UserEntity;

      userRepository.findOne.mockResolvedValueOnce(userEntity);

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(service.loginUser(loginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      process.env.JWT_SECRET = 'testsecret';
      const user = {
        id: 1,
        username: 'john',
        email: 'john@example.com',
      } as UserEntity;

      const token = service.generateToken(user);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });
});
