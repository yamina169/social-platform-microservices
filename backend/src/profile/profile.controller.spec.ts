import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  const mockProfile = { id: 1, username: 'john', following: false } as any;
  const mockResponse = { profile: { ...mockProfile } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getProfile: jest.fn(),
            followProfile: jest.fn(),
            unfoldowProfile: jest.fn(),
            generateProfileResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ProfileController);
    service = module.get(ProfileService);
  });

  it('getProfile should return profile response', async () => {
    service.getProfile.mockResolvedValue(mockProfile);
    service.generateProfileResponse.mockReturnValue(mockResponse);

    const result = await controller.getProfile(2, 'john');
    expect(service.getProfile).toHaveBeenCalledWith(2, 'john');
    expect(result).toEqual(mockResponse);
  });

  it('followProfile should follow and return profile', async () => {
    service.followProfile.mockResolvedValue({
      ...mockProfile,
      following: true,
    });
    service.generateProfileResponse.mockReturnValue(mockResponse);

    const result = await controller.followProfile(2, 'john');
    expect(service.followProfile).toHaveBeenCalledWith(2, 'john');
  });

  it('unfollowProfile should unfollow and return profile', async () => {
    service.unfoldowProfile.mockResolvedValue({
      ...mockProfile,
      following: false,
    });
    service.generateProfileResponse.mockReturnValue(mockResponse);

    const result = await controller.unfollowProfile(2, 'john');
    expect(service.unfoldowProfile).toHaveBeenCalledWith(2, 'john');
  });
});
