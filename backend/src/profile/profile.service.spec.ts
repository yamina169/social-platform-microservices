import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { UserEntity } from '@/user/user.entity';
import { FollowEntity } from './types/follow.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let followRepository: jest.Mocked<Repository<FollowEntity>>;

  const mockUser: UserEntity = {
    id: 1,
    username: 'john',
    email: 'john@example.com',
    password: 'hashed',
    bio: '',
    image: '',
    articles: [],
    favorites: [],
  } as any;

  const mockFollow: FollowEntity = {
    id: 1,
    followerId: 2,
    followingId: 1,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(FollowEntity),
          useValue: { findOne: jest.fn(), save: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    followRepository = module.get(getRepositoryToken(FollowEntity));
  });

  describe('getProfile', () => {
    it('should return profile with following=false if not followed', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      followRepository.findOne.mockResolvedValue(null);

      const result = await service.getProfile(2, 'john');
      expect(result).toEqual({ ...mockUser, following: false });
    });

    it('should return profile with following=true if followed', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      followRepository.findOne.mockResolvedValue(mockFollow);

      const result = await service.getProfile(2, 'john');
      expect(result).toEqual({ ...mockUser, following: true });
    });

    it('should throw if profile not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.getProfile(2, 'unknown')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('followProfile', () => {
    it('should follow a user if not already followed', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      followRepository.findOne.mockResolvedValue(null);

      const result = await service.followProfile(2, 'john');
      expect(followRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...mockUser, following: true });
    });

    it('should throw if trying to follow self', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      await expect(service.followProfile(1, 'john')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('unfoldowProfile', () => {
    it('should unfollow a user', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.unfoldowProfile(2, 'john');
      expect(followRepository.delete).toHaveBeenCalledWith({
        followerId: 2,
        followingId: 1,
      });
      expect(result).toEqual({ ...mockUser, following: false });
    });

    it('should throw if profile does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.unfoldowProfile(2, 'unknown')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('generateProfileResponse', () => {
    it('should remove email and password', () => {
      const profileWithSensitive = { ...mockUser, following: true } as any;
      const response = service.generateProfileResponse(profileWithSensitive);
      expect(response.profile.email).toBeUndefined();
      expect(response.profile.password).toBeUndefined();
      expect(response.profile.following).toBe(true);
    });
  });
});
