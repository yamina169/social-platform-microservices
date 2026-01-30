import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';

describe('TagService', () => {
  let service: TagService;
  let repoMock: any;

  beforeEach(async () => {
    repoMock = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should return all tags', async () => {
    const tags = [{ id: 1, name: 'nestjs', createdAt: new Date() }];
    repoMock.find.mockResolvedValue(tags);

    const result = await service.getAll();
    expect(result).toEqual(tags);
    expect(repoMock.find).toHaveBeenCalled();
  });
});
