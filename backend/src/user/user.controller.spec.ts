import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IUserResponse } from './types/userResponse.interface';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  // ✅ Mock complet d'un utilisateur conforme à UserType
  const mockUser = {
    id: 1,
    username: 'john',
    email: 'john@example.com',
    bio: '',
    image: '',
    articles: [],
    favorites: [],
  };

  const mockUserResponse: IUserResponse = {
    user: {
      ...mockUser,
      token: 'jwt',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            loginUser: jest.fn(),
            updateUser: jest.fn(),
            generateUserResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  describe('createUser', () => {
    it('should call userService.createUser and return a valid IUserResponse', async () => {
      const dto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: 'pass',
      };

      userService.createUser.mockResolvedValue(mockUserResponse);

      const result = await controller.createUser(dto);
      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('loginUser', () => {
    it('should call userService.loginUser and generateUserResponse', async () => {
      const dto: LoginDto = { email: 'john@example.com', password: 'pass' };

      userService.loginUser.mockResolvedValue(mockUser as any);
      userService.generateUserResponse.mockReturnValue(mockUserResponse);

      const result = await controller.loginUser(dto);
      expect(userService.loginUser).toHaveBeenCalledWith(dto);
      expect(userService.generateUserResponse).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('updateUser', () => {
    it('should call userService.updateUser and generateUserResponse', async () => {
      // ✅ Seuls les champs existants dans UpdateUserDto
      const dto: UpdateUserDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        bio: 'Updated bio',
        image: 'https://image.url/profile.jpg',
      };

      const userId = 1;

      const updatedUser = { ...mockUser, ...dto };
      const updatedResponse: IUserResponse = {
        user: { ...updatedUser, token: 'jwt' },
      };

      userService.updateUser.mockResolvedValue(updatedUser as any);
      userService.generateUserResponse.mockReturnValue(updatedResponse);

      const result = await controller.updateUser(userId, dto);
      expect(userService.updateUser).toHaveBeenCalledWith(userId, dto);
      expect(userService.generateUserResponse).toHaveBeenCalledWith(
        updatedUser,
      );
      expect(result).toEqual(updatedResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user response', async () => {
      userService.generateUserResponse.mockReturnValue(mockUserResponse);

      const result = await controller.getCurrentUser(mockUser, mockUser.id);
      expect(userService.generateUserResponse).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserResponse);
    });
  });
});
